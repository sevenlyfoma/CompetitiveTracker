package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.TournamentDTO;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentAlreadyClosedException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentNameNotUniqueException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentNotEnoughEntrantsException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentNotFoundException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentStyleNotValidException;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrant;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrantRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;

@Service
public class TournamentService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);
    
    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Autowired
    private TournamentEntrantRepository tournamentEntrantRepository;

    public Iterable<Tournament> getAllTournaments(){
        return tournamentRepository.findAll();
    }

    public Tournament getTournament(long tournamentID){
        var t = tournamentRepository.findById(tournamentID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));
        return t;
    }

    @Transactional
    public Tournament createTournament(TournamentDTO tdto){

        logger.info(tdto.toString());
        
        validateStyleExists(tdto.getStyle());

        validateTournamentNameNotTaken(tdto.getName(), null);

        Tournament t = Tournament.builder()
            .closed(false)
            .style(tdto.getStyle())
            .tournamentName(tdto.getName())
            .build();

        tournamentRepository.save(t);

        return t;
    }

    @Transactional
    public void deleteTournament(Long id){
        
        Tournament t = validateTournamentExists(id);

        validateNotAlreadyClosed(t);

        List<TournamentEntrant> tes = tournamentEntrantRepository.findByTournament(t);

        tournamentEntrantRepository.deleteAll(tes);

        tournamentRepository.delete(t);
        

        
    }

    @Transactional
    public Tournament updateTournament(TournamentDTO tdto, Long id){

        logger.info(id + " " + tdto.toString());
        Tournament t = validateTournamentExists(id);

        validateNotAlreadyClosed(t);

        validateStyleExists(tdto.getStyle());

        validateTournamentNameNotTaken(tdto.getName(), t);

        t.setStyle(tdto.getStyle());
        t.setTournamentName(tdto.getName());

        tournamentRepository.save(t);

        return t;


    }

    @Transactional
    public void closeTournament(long tournamentID){
        var t = tournamentRepository.findById(tournamentID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));
        
        validateNotAlreadyClosed(t);
        
        var entrants = tournamentEntrantRepository.findByTournament(t);

        validateEnoughEntrants(t, entrants);


        List<User> sortedUsers = entrants.stream()
            .sorted(Comparator.comparing(entrant -> entrant.getUser().getRating()))
            .map(TournamentEntrant::getUser)
            .collect(Collectors.toList());

        var leng = sortedUsers.size();
        var closestPowerOfTwo = Integer.highestOneBit(leng);
        // var difference = leng - closestPowerOfTwo;

        // logger.info(Integer.toString(leng) + " " + Integer.toString(closestPowerOfTwo) + " " + Integer.toString(difference));

        if (leng != closestPowerOfTwo){
            for (int i = 0; i < closestPowerOfTwo*2 - leng; i++){
                 var u = User.builder().name("bye").email("x"+i).rating(0).build();
                sortedUsers.add(0, u);
            }
        }
        

        // for (User u: sortedUsers){
        //     logger.info(u.getId() + " " + u.getName() + " " + u.getRating().toString());
        // }
        
        List<TournamentMatch> tms = new ArrayList<>();
        if (t.getStyle().equals("single")){
            tms =  generateSingleElimBracket(sortedUsers, t);
        }
        else if (t.getStyle().equals("double")){
            tms =  generateDoubleElimBracket(sortedUsers, t);
        }

         

        for (TournamentMatch tm: tms){
            tournamentMatchRepository.save(tm);
        }

        t.setClosed(true);

        tournamentRepository.save(t);

    }

    private List<TournamentMatch> generateDoubleElimBracket(List<User> users, Tournament t){
        List<TournamentMatch> tms = new ArrayList<>();

        long matchNumber = 1L;

        int winnersRoundNumber = 1;

        for (int i = 0; i < users.size()/2; i++){
            User user1 = users.get(i);
            User user2 = users.get(users.size()-1-i);
            TournamentMatch tm = TournamentMatch.builder()
                .tournament(t)
                .user1(user1)
                .user2(user2)
                .matchTitle("Winner's Round " + winnersRoundNumber)
                .matchNumber( matchNumber++ )
                .build();

            tms.add(tm);
        }

        long loserMatchNumber = (matchNumber * 2);

        int losersRoundNumber = 1;
        

        List<TournamentMatch> totalTMs = new ArrayList<>();

        totalTMs.addAll(tms);

        List<TournamentMatch> totalLoserTMs = new ArrayList<>();
        List<TournamentMatch> loserTMs = new ArrayList<>();

        int count = 0;

        while (tms.size() > 1){
            winnersRoundNumber++;
            List<TournamentMatch> sortedTMs = tms.stream()
                .sorted(Comparator.comparing(match -> findExpectedWinner(match).getRating(), Comparator.reverseOrder()))
                .collect(Collectors.toList());

            
        
            tms = new ArrayList<>();
            

            for (int i = 0; i < sortedTMs.size()/2; i++){
                var tm1 = sortedTMs.get(i);
                var tm2 = sortedTMs.get(sortedTMs.size()-1-i);

                TournamentMatch tm = TournamentMatch.builder()
                    .tournament(t)
                    .matchTitle("Winner's Round" + winnersRoundNumber)
                    .parentMatch1(tm1)
                    .parentMatch2(tm2)
                    .inheritsParentMatch1Winner(true)
                    .inheritsParentMatch2Winner(true)
                    .matchNumber( matchNumber++ )
                    .build();

                tms.add(tm);

                //If we're on the first cycle
                if (count == 0){
                    TournamentMatch tmL = TournamentMatch.builder()
                        .tournament(t)
                        .matchTitle("Loser's Round " + losersRoundNumber)
                        .parentMatch1(tm1)
                        .parentMatch2(tm2)
                        .inheritsParentMatch1Winner(false)
                        .inheritsParentMatch2Winner(false)
                        .matchNumber( loserMatchNumber++ )
                        .build();

                    loserTMs.add(tmL);
                    totalLoserTMs.add(tmL);

                    // logger.info("Creating losers round 1 match " + i);
                }

            }

            List<TournamentMatch> sortedLoserTMs = loserTMs.stream()
                .sorted(Comparator.comparing(match -> findExpectedWinner(match).getRating()))
                .collect(Collectors.toList());

            // logger.info("sltms: " +sortedLoserTMs.size() + ", tms:" + tms.size() );

            loserTMs = new ArrayList<>();

            if (sortedLoserTMs.size() != tms.size()){
                losersRoundNumber++;
                for (int i = 0; i < sortedLoserTMs.size()/2; i++){
                    var tm1 = sortedLoserTMs.get(i);
                    var tm2 = sortedLoserTMs.get(sortedLoserTMs.size()-1-i);

                    TournamentMatch tmL = TournamentMatch.builder()
                            .tournament(t)
                            .matchTitle("Loser's Round " + losersRoundNumber)
                            .parentMatch1(tm1)
                            .parentMatch2(tm2)
                            .inheritsParentMatch1Winner(true)
                            .inheritsParentMatch2Winner(true)
                            .matchNumber( loserMatchNumber++ )
                            .build();

                    loserTMs.add(tmL);
                    totalLoserTMs.add(tmL);
                }

                sortedLoserTMs = loserTMs.stream()
                .sorted(Comparator.comparing(match -> findExpectedWinner(match).getRating()))
                .collect(Collectors.toList());
                
                loserTMs = new ArrayList<>();
            }

            sortedTMs = tms.stream()
                .sorted(Comparator.comparing(match -> findExpectedWinner(match).getRating()))
                .collect(Collectors.toList());
                
            List<TournamentMatch> tempLosers = new ArrayList<>();
            losersRoundNumber++;
            for (int i = 0; i < sortedTMs.size(); i++){
                var tm1 = sortedTMs.get(i);
                var tm2 = sortedLoserTMs.get(i);

                TournamentMatch tmL = TournamentMatch.builder()
                        .tournament(t)
                        .matchTitle("Loser's Round " + losersRoundNumber)
                        .parentMatch1(tm1)
                        .parentMatch2(tm2)
                        .inheritsParentMatch1Winner(false)
                        .inheritsParentMatch2Winner(true)
                        .matchNumber( loserMatchNumber++ )
                        .build();
                
                tempLosers.add(tmL);
                totalLoserTMs.add(tmL);
            }
            

            if (!tempLosers.isEmpty()){
                loserTMs = tempLosers;
            }

            // if (count == 0){logger.info("ltms: "  + loserTMs.size() );}

            


            totalTMs.addAll(tms);


            count++;
        }

        TournamentMatch grandfinal = TournamentMatch.builder()
            .tournament(t)
            .matchTitle("Grand Finals")
            .parentMatch1(tms.get(0))
            .parentMatch2(loserTMs.get(0))
            .inheritsParentMatch1Winner(true)
            .inheritsParentMatch2Winner(true)
            .matchNumber( 0L )
            .build();

        
        // logTournamentShape();


        totalTMs.addAll(totalLoserTMs);
        totalTMs.add(grandfinal);

        removeByesRecursive(grandfinal);
        // addMatchNumbers(grandfinal);
        addMatchNumbersDouble(grandfinal);
        addTitleMatchNamesDouble(grandfinal);
        var cleanTMs = removeUnusedMatches(totalTMs);

        return cleanTMs;
    }

    private void addTitleMatchNamesDouble(TournamentMatch match){

        match.setMatchTitle("Grand Finals");

        addTitleMatchNames(match.getParentMatch1(), 1, "Winner's ");

        addTitleMatchNames(match.getParentMatch2(), 1, "Loser's ");
        
    }

    private void addTitleMatchNames(TournamentMatch match, int depth, String front){
        String matchTitle = front;


        switch (depth) {
            case 1 -> matchTitle += " Finals";
            case 2 -> matchTitle += " Semifinals";
            case 3 -> matchTitle += " Quaterfinals";
            default -> {
            }
        }

        match.setMatchTitle(matchTitle);

        if (depth < 3){
            if (match.getParentMatch1() != null && match.getInheritsParentMatch1Winner() == true){
                addTitleMatchNames(match.getParentMatch1(), depth+1, front);
            }
            if (match.getParentMatch2() != null && match.getInheritsParentMatch2Winner() == true){
                addTitleMatchNames(match.getParentMatch2(), depth+1, front);
            }
        }




    }

    private void addMatchNumbersDouble(TournamentMatch finalMatch){
        TournamentMatch winnersFinal = finalMatch.getParentMatch1();

        addMatchNumbers(winnersFinal, 1);

        TournamentMatch losersFinal = finalMatch.getParentMatch2();

        addMatchNumbers(losersFinal, winnersFinal.getMatchNumber().intValue());


        finalMatch.setMatchNumber(0L);

    }

    private void addMatchNumbers(TournamentMatch finalMatch, int modifier){

        LinkedList<TournamentMatch> queue = new LinkedList<>();

        List<TournamentMatch> traversedMatches = new ArrayList<>();

        queue.add(finalMatch);

        while (!queue.isEmpty()){
            TournamentMatch current = queue.remove();

            if (current.getParentMatch2() != null && current.getInheritsParentMatch2Winner() == true){
                queue.add(current.getParentMatch2());
            }

            if (current.getParentMatch1() != null && current.getInheritsParentMatch1Winner() == true){
                queue.add(current.getParentMatch1());
            }
            
            

            traversedMatches.add(current);
        }


        for (int i = 0; i < traversedMatches.size(); i++){
            TournamentMatch tm = traversedMatches.get(traversedMatches.size()-1-i);

            tm.setMatchNumber((long) (i+modifier));
        }




    }

    private Boolean isBye(User u){
        return (u != null && u.getId() == null);
    }

    private void removeByesRecursive(TournamentMatch tm){

        if (tm == null){
            return;
        }

        TournamentMatch p1 = tm.getParentMatch1();
        TournamentMatch p2 = tm.getParentMatch2();

        removeByesRecursive(p1);
        removeByesRecursive(p2);

        if (p1 != null){
            if (isBye(p1.getUser1())){
                if (p1.getUser2() != null){
                    if (tm.getInheritsParentMatch1Winner()){
                        tm.setUser1(p1.getUser2());
                    }
                    else{
                        tm.setUser1(p1.getUser1());
                    }
                    tm.setInheritsParentMatch1Winner(null);
                    tm.setParentMatch1(null);
                }
                else{
                    if (p1.getParentMatch1() == null){
                        tm.setParentMatch1(p1.getParentMatch2());
                        tm.setInheritsParentMatch1Winner(p1.getInheritsParentMatch2Winner());
                    }
                    else{
                        tm.setParentMatch1(p1.getParentMatch1());
                        tm.setInheritsParentMatch1Winner(p1.getInheritsParentMatch1Winner());
                    }
                }  
            }
            else if (isBye(p1.getUser2())){
                if (p1.getUser1() != null){
                    if (tm.getInheritsParentMatch1Winner()){
                        tm.setUser1(p1.getUser1());
                    }
                    else{
                        tm.setUser1(p1.getUser2());
                    }
                    tm.setInheritsParentMatch1Winner(null);
                    tm.setParentMatch1(null);
                }
                else{
                    if (p1.getParentMatch1() == null){
                        tm.setParentMatch1(p1.getParentMatch2());
                        tm.setInheritsParentMatch1Winner(p1.getInheritsParentMatch2Winner());
                    }
                    else{
                        tm.setParentMatch1(p1.getParentMatch1());
                        tm.setInheritsParentMatch1Winner(p1.getInheritsParentMatch1Winner());
                    }
                }  
            }
        }


        if (p2 != null){
            if (isBye(p2.getUser1())){
                if (p2.getUser2() != null){
                    if (tm.getInheritsParentMatch2Winner()){
                        tm.setUser2(p2.getUser2());
                    }
                    else{
                        tm.setUser2(p2.getUser1());
                    }
                    tm.setInheritsParentMatch2Winner(null);
                    tm.setParentMatch2(null);
                }
                else{
                    if (p2.getParentMatch1() == null){
                        tm.setParentMatch2(p2.getParentMatch2());
                        tm.setInheritsParentMatch2Winner(p2.getInheritsParentMatch2Winner());
                    }
                    else{
                        tm.setParentMatch2(p2.getParentMatch1());
                        tm.setInheritsParentMatch2Winner(p2.getInheritsParentMatch1Winner());
                    }
                }  
            }
            else if (isBye(p2.getUser2())){
                if (p2.getUser1() != null){
                    if (tm.getInheritsParentMatch2Winner()){
                        tm.setUser2(p2.getUser1());
                    }
                    else{
                        tm.setUser2(p2.getUser2());
                    }
                    tm.setInheritsParentMatch2Winner(null);
                    tm.setParentMatch2(null);
                }
                else{
                    if (p2.getParentMatch1() == null){
                        tm.setParentMatch2(p2.getParentMatch2());
                        tm.setInheritsParentMatch2Winner(p2.getInheritsParentMatch2Winner());
                    }
                    else{
                        tm.setParentMatch2(p2.getParentMatch1());
                        tm.setInheritsParentMatch2Winner(p2.getInheritsParentMatch1Winner());
                    }
                }  
            }
        }



        // if (p1 != null && p1.getUser1() != null && p1.getUser1().getId() == null){
        //     p1.setUser1(null);
        // }
        
        // if (p1 != null && p1.getUser2() != null && p1.getUser2().getId() == null){
        //     p1.setUser2(null);
        // }

        // if (p2 != null && p2.getUser1() != null && p2.getUser1().getId() == null){
        //     p2.setUser1(null);
        // }
        
        // if (p2 != null && p2.getUser2() != null && p2.getUser2().getId() == null){
        //     p2.setUser2(null);
        // }



    }

    private List<TournamentMatch> removeUnusedMatches(List<TournamentMatch> tms){
        List<TournamentMatch> cleanTMs = new ArrayList<>();

        for (TournamentMatch tm: tms){
            if (!isBye(tm.getUser1()) && !isBye(tm.getUser2())){
                cleanTMs.add(tm);
            }
        }


        return cleanTMs;
    }

    private List<TournamentMatch> generateSingleElimBracket(List<User> users, Tournament t){

        List<TournamentMatch> tms = new ArrayList<>();

        int roundNumber = 1;

        for (int i = 0; i < users.size()/2; i++){
            User user1 = users.get(i);
            User user2 = users.get(users.size()-1-i);
            TournamentMatch tm = TournamentMatch.builder()
                .tournament(t)
                .user1(user1)
                .user2(user2)
                .matchTitle("Round " + roundNumber)
                .matchNumber( ((long) Integer.numberOfTrailingZeros(users.size())) - 1L )
                .build();

            tms.add(tm);
        }

        List<TournamentMatch> totalTMs = new ArrayList<>();

        for (TournamentMatch tm: tms){
            if (tm.getUser1().getId() != null && tm.getUser2().getId() != null){
                totalTMs.add(tm);
            }
        }

        while (tms.size() > 1){
            roundNumber++;
            List<TournamentMatch> sortedTMs = tms.stream()
                .sorted(Comparator.comparing(match -> findExpectedWinner(match).getRating()))
                .collect(Collectors.toList());
        
            tms = new ArrayList<>();

            for (int i = 0; i < sortedTMs.size()/2; i++){
                var tm1 = sortedTMs.get(i);
                var tm2 = sortedTMs.get(sortedTMs.size()-1-i);

                TournamentMatch p1 = null;
                TournamentMatch p2 = null;

                Boolean p1InheritsWinner = null;
                Boolean p2InheritsWinner = null;


                User byeUser1 = null;
                User byeUser2 = null;

                if (tm1.getUser1() != null && tm1.getUser1().getId() == null){
                    byeUser1 = tm1.getUser2();
                }
                else if (tm1.getUser2() != null && tm1.getUser2().getId() == null){
                    byeUser1 = tm1.getUser1();
                }
                else {
                    p1 = tm1;
                    p1InheritsWinner = true;
                }

                if (tm2.getUser1() != null && tm2.getUser1().getId() == null){
                    byeUser2 = tm2.getUser2();
                }
                else if (tm2.getUser2() != null && tm2.getUser2().getId() == null){
                    byeUser2 = tm2.getUser1();
                }
                else {
                    p2 = tm2;
                    p2InheritsWinner = true;
                }

                TournamentMatch tm = TournamentMatch.builder()
                    .tournament(t)
                    .matchTitle("Round " + roundNumber)
                    .user1(byeUser1)
                    .user2(byeUser2)
                    .parentMatch1(p1)
                    .parentMatch2(p2)
                    .inheritsParentMatch1Winner(p1InheritsWinner)
                    .inheritsParentMatch2Winner(p2InheritsWinner)
                    .matchNumber( ((long) Integer.numberOfTrailingZeros(sortedTMs.size())) - 1L )
                    .build();

                // logger.info(tm.getMatchNumber().toString());

                tms.add(tm);
            }

            totalTMs.addAll(tms);

            
        }

        addMatchNumbers(totalTMs.getLast(), 1);
        addTitleMatchNames(totalTMs.getLast(), 1, "");

        totalTMs.getLast().setMatchNumber(0L);




        return totalTMs;
    }
    
    
    private User findExpectedLoser(TournamentMatch tm){
        User u;

        User u1 = tm.getUser1();
        User u2 = tm.getUser2();

        if (u1 == null){
            if (tm.getInheritsParentMatch1Winner()){
                u1 = findExpectedWinner(tm.getParentMatch1());
            }
            else {
                u1 = findExpectedLoser(tm.getParentMatch1());
            }
            
        }
        if (u2 == null) {
            if (tm.getInheritsParentMatch2Winner()){
                u2 = findExpectedWinner(tm.getParentMatch2());
            }
            else {
                u2 = findExpectedLoser(tm.getParentMatch2());
            }
        }

        if (u1.getRating() < u2.getRating()){
            u = u1;
        }
        else{
            u = u2;
        }

        return u;
    }
    
    private User findExpectedWinner(TournamentMatch tm){
        User u;

        User u1 = tm.getUser1();
        User u2 = tm.getUser2();

        if (u1 == null){
            if (tm.getInheritsParentMatch1Winner()){
                u1 = findExpectedWinner(tm.getParentMatch1());
            }
            else {
                u1 = findExpectedLoser(tm.getParentMatch1());
            }
            
        }
        if (u2 == null) {
            if (tm.getInheritsParentMatch2Winner()){
                u2 = findExpectedWinner(tm.getParentMatch2());
            }
            else {
                u2 = findExpectedLoser(tm.getParentMatch2());
            }
        }

        if (u1.getRating() > u2.getRating()){
            u = u1;
        }
        else{
            u = u2;
        }

        return u;
    }

    private Tournament validateTournamentExists(Long id){
        Optional<Tournament> ot = tournamentRepository.findById(id);

        if (ot.isEmpty()){
            logger.error("Validation failed in Tournament Service for Tournament id {}: Tournament does not exist", id);
            throw new TournamentNotFoundException("Tournament does not exist");
        }

        return ot.get();
    }

    private void validateTournamentNameNotTaken(String name, Tournament t){
        long currentID = -1;
        if (t != null){
            currentID = t.getId();
        }

        Tournament nameTournament = tournamentRepository.findByTournamentName(name);

        if (nameTournament != null && nameTournament.getId() != currentID){
            logger.error("Validation failed in Tournament Service for Tournament name {}: name already taken by another tournament", name);
            throw new TournamentNameNotUniqueException("Tournament Name Already Taken By Another Tournament");
        }
    }

    private void validateStyleExists(String style){
        if (!style.equals("single") && !style.equals("double")){
            logger.error("Validation failed for Tournament Creation: Style '{}' not supported", style);

            throw new TournamentStyleNotValidException("Entered Tournament Style Not Supported");
        }
    }
    
    private void validateNotAlreadyClosed(Tournament t) {

        if (t.getClosed()) {
            logger.error("Validation failed for Tournament ID {}: The tournament has already been closed", t.getId());
            throw new TournamentAlreadyClosedException("Cannot close Tournament, Tournament Already Closed");
        }
    }

    private void validateEnoughEntrants(Tournament t, List<TournamentEntrant> entrants){
        if (entrants.size() < 3){
            logger.error("Validation failed for Tournament ID {}: The tournament must have at least 3 entrants", t.getId());
            throw new TournamentNotEnoughEntrantsException("A tournament must have at least 3 entrants");
        }
    }

}

