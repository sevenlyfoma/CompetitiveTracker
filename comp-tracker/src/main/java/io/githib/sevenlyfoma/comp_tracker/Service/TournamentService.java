package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;
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
import io.githib.sevenlyfoma.comp_tracker.Refactor.TournamentMatchParent;
import io.githib.sevenlyfoma.comp_tracker.Refactor.TournamentMatchParentRepository;

@Service
public class TournamentService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);
    
    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Autowired
    private TournamentEntrantRepository tournamentEntrantRepository;

    @Autowired
    private TournamentMatchParentRepository tournamentMatchParentRepository;

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
            // tms =  generateDoubleElimBracketNew(sortedUsers, t);

            // var ntms = generateDoubleElimBracketNew(sortedUsers, t);
            // logger.info(ntms.get(0).toString()); 
            // for (var ntm: ntms){
            //     logger.info(ntm.toString());
            // }

            var gf = generateDoubleElimBracketNew(sortedUsers, t);
            saveRecursive(gf);
        }

         

        // for (TournamentMatch tm: tms){

        //     // logger.info(tm.toString());

        //     var tmps = tm.getParents();
        //     tm.setParents(null);

        //     // tmps = tm.tmps
        //     // tm.settmps(null)
        //     //save(tm)
        //     //for tmp: tmps: save(tmp) //gotta make a new repo for tmp
            
        //     var ntm = tournamentMatchRepository.save(tm);
        //     tm.setId(ntm.getId());


        //     for (var tmp: tmps){
        //         tmp.setTournamentMatch(ntm);
        //         tournamentMatchParentRepository.save(tmp);
        //     }


        //     // logger.info(tm.toString());
        // }

        t.setClosed(true);

        tournamentRepository.save(t);

    }

    private void saveRecursive(TournamentMatch m){

        if (m == null){
            // logger.info("null");
            return;
            
        }

        var count = 0;
        if (m.getParents() != null){
            for (var tmp: m.getParents()){
                // logger.info(""+count);count++;
                saveRecursive(tmp.getParentMatch());
            }
        }

        // logger.info("start");
        

        var tmps = m.getParents();
        m.setParents(null);

        var nm = tournamentMatchRepository.save(m);
        m.setId(nm.getId());

        if (tmps != null){
            for (var tmp: tmps){
                



                tmp.setTournamentMatch(nm);

                // logger.info("");
                // logger.info("tmatchid:" + tmp.getTournamentMatch().getId());
                if (isBye(tmp.getUser())){
                    // logger.info("Is bye");
                }

                if (tmp.getParentMatch() != null){
                    if (tmp.getParentMatch().getId() == null){
                        // logger.info("parentmatch id is null");
                    }
                    else{
                        // logger.info("pmatch id: " + tmp.getParentMatch().getId());
                    }
                }


                // logger.info("");


                tournamentMatchParentRepository.save(tmp);
            }
        }


        
    }

    
    private User findExpectedWinnerOrLoser(TournamentMatch tm, Boolean winner){
        User u;

        List<User> usersForComparison = new ArrayList<>();

        for (TournamentMatchParent tmp: tm.getParents()){
            User tmpu = tmp.getUser();
            if (tmpu == null){
                tmpu = findExpectedWinnerOrLoser(tmp.getParentMatch(), tmp.getInheritsParentMatchWinner());
            }
            usersForComparison.add(tmpu);
        }

        if (winner){
            u = usersForComparison.stream()
                    .max(Comparator.comparingInt(User::getRating))
                    .orElse(null);
        }
        else{
            u = usersForComparison.stream()
                    .min(Comparator.comparingInt(User::getRating))
                    .orElse(null);
        }

    
        return u;
    }

    private TournamentMatch generateTM(Tournament t, List<User> users, List<TournamentMatch> parents, List<Boolean> inheritStatuses){

        if (users.size() != parents.size() || users.size() != inheritStatuses.size()){
            logger.error("Error: Creation of tournament Match given unequal list input sizes");
            return null;
        }
        
        TournamentMatch tm = TournamentMatch.builder().tournament(t).build();

        List<TournamentMatchParent> tmps = new ArrayList<>();

        for (int i = 0; i < users.size(); i++){
            TournamentMatchParent tmp = TournamentMatchParent.builder()
            .user(users.get(i))
            .parentMatch(parents.get(i))
            .inheritsParentMatchWinner(inheritStatuses.get(i))
            .build();

            tmps.add(tmp);
        }

        tm.setParents(tmps);

        


        return tm;
    }

    private List<TournamentMatch> sortByExpectedWinner(List<TournamentMatch> tms){
        return tms.stream()
        .sorted(Comparator.comparing(match -> findExpectedWinnerOrLoser(match, true).getRating(), Comparator.reverseOrder()))
        .collect(Collectors.toList());
    }
    
    
    private TournamentMatch generateDoubleElimBracketNew(List<User> users, Tournament t){

        List<TournamentMatch> totalWinnerTms = new ArrayList<>();

        List<TournamentMatch> winnerTms = new ArrayList<>();

        List<TournamentMatch> totalLoserTms = new ArrayList<>();

        List<TournamentMatch> loserTms = new ArrayList<>();


        //Generate first set of matches
        //We will append missing fields later
        for (int i = 0; i < users.size()/2; i++){

            User u1 = users.get(i);
            User u2 = users.get(users.size()-1-i);

            TournamentMatch tm = generateTM(t, Arrays.asList(u1, u2), Arrays.asList(null, null), Arrays.asList(null, null));

            winnerTms.add(tm);
        }

        totalWinnerTms.addAll(winnerTms);

        List<TournamentMatch> sortedWinnerTms = sortByExpectedWinner(winnerTms);
        
        //Generate first set of losers Matches
        for (int i = 0; i < sortedWinnerTms.size()/2; i++){
            var tm1 = sortedWinnerTms.get(i);
            var tm2 = sortedWinnerTms.get(sortedWinnerTms.size()-1-i);

            TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(false, false));

            loserTms.add(tm);
                
        }

        totalLoserTms.addAll(loserTms);

        while (sortedWinnerTms.size() > 1){
            winnerTms = new ArrayList<>();

            for (int i = 0; i < sortedWinnerTms.size()/2; i++){
                var tm1 = sortedWinnerTms.get(i);
                var tm2 = sortedWinnerTms.get(sortedWinnerTms.size()-1-i);

                TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(true, true));

                winnerTms.add(tm);
                
            }

            List<TournamentMatch> sortedLoserTms = sortByExpectedWinner(loserTms);
            loserTms = new ArrayList<>();

            //Match losers winners against each other until there are low enough to pair against winners losers
            if (sortedLoserTms.size() != winnerTms.size()){

                for (int i = 0; i < sortedLoserTms.size()/2; i++){
                    var tm1 = sortedLoserTms.get(i);
                    var tm2 = sortedLoserTms.get(sortedLoserTms.size()-1-i);

                    TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(true, true));

                    loserTms.add(tm);
                    totalLoserTms.add(tm);
                }

                sortedLoserTms = sortByExpectedWinner(loserTms);
                loserTms = new ArrayList<>();
            }

            sortedWinnerTms =  sortByExpectedWinner(winnerTms);
                
            List<TournamentMatch> tempLosers = new ArrayList<>();
            for (int i = 0; i < sortedWinnerTms.size(); i++){
                var tm1 = sortedWinnerTms.get(i);
                var tm2 = sortedLoserTms.get(i);

                TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(false, true));
                
                tempLosers.add(tm);
                totalLoserTms.add(tm);
            }
            
            if (!tempLosers.isEmpty()){
                loserTms = tempLosers;
            }


            totalWinnerTms.addAll(winnerTms);

            sortedWinnerTms =  sortByExpectedWinner(winnerTms);
            
        }

        // logger.info("" + winnerTms.size());
        // logger.info("" + loserTms.size());
        var winnerFinal = winnerTms.get(0);
        var loserFinal = loserTms.get(0);

        TournamentMatch grandfinal = generateTM(t, Arrays.asList(null, null), Arrays.asList(winnerFinal, loserFinal), Arrays.asList(true, true));

        List<TournamentMatch> totalTms = new ArrayList<>();
        totalTms.addAll(totalWinnerTms);
        totalTms.addAll(totalLoserTms);
        totalTms.add(grandfinal);

        removeByesRecursiveNew(grandfinal);
        addMatchNumbersDoubleNew(grandfinal);
        addTitleMatchNamesDoubleNew(grandfinal);
        var cleanTMs = removeUnusedMatchesNew(totalTms);

        // return cleanTMs;

        return grandfinal;

        // return totalTms;
    }

    private void addMatchNumbersDoubleNew(TournamentMatch finalMatch){
        TournamentMatch winnersFinal = finalMatch.getParents().get(0).getParentMatch();

        addMatchNumbersNew(winnersFinal, 1);

        TournamentMatch losersFinal = finalMatch.getParents().get(1).getParentMatch();

        addMatchNumbersNew(losersFinal, winnersFinal.getMatchNumber().intValue());


        finalMatch.setMatchNumber(0L);

    }

    private void addMatchNumbersNew(TournamentMatch finalMatch, int modifier){

        LinkedList<TournamentMatch> queue = new LinkedList<>();

        List<TournamentMatch> traversedMatches = new ArrayList<>();

        queue.add(finalMatch);

        while (!queue.isEmpty()){
            TournamentMatch current = queue.remove();

            if (current != null){
                 for (int i = 0; i < current.getParents().size(); i++){
                    queue.add(current.getParents().get(current.getParents().size() - i - 1).getParentMatch());
                }

                traversedMatches.add(current);
            }

           
        }


        for (int i = 0; i < traversedMatches.size(); i++){
            TournamentMatch tm = traversedMatches.get(traversedMatches.size()-1-i);

            tm.setMatchNumber((long) (i+modifier));
        }




    }


     private List<TournamentMatch> removeUnusedMatchesNew(List<TournamentMatch> tms){
       List<TournamentMatch> cleanTMs = new ArrayList<>();

        for (TournamentMatch tm: tms){
            var tmps = tm.getParents();

            boolean allValid = tmps.stream().noneMatch(t -> isBye(t.getUser()));

            if (allValid){
                cleanTMs.add(tm);
            }
        }


        return cleanTMs;
    }


    private void addTitleMatchNamesDoubleNew(TournamentMatch match){
        match.setMatchTitle("Grand Finals");

        addTitleMatchNamesNew(match.getParents().get(0).getParentMatch(), 1, "Winner's ");

        addTitleMatchNamesNew(match.getParents().get(1).getParentMatch(), 1, "Loser's ");
    }

    private int addTitleMatchNamesNew(TournamentMatch match, int depth, String front){
        if (match == null){
            return depth;
        }

        String matchTitle = front;

        List<Integer> depths = new ArrayList<>();

        for (var tmps: match.getParents()){
            if (tmps != null && tmps.getInheritsParentMatchWinner() != null && tmps.getInheritsParentMatchWinner()){
                depths.add(addTitleMatchNamesNew(tmps.getParentMatch(), depth+1, front));
            }
            else {depths.add(depth +1);}
        }   

        int greatestDepth = depths.stream().mapToInt(v -> v).max().orElseThrow(NoSuchElementException::new);

        switch (depth) {
            case 1 -> matchTitle += " Finals";
            case 2 -> matchTitle += " Semifinals";
            case 3 -> matchTitle += " Quaterfinals";
            default -> matchTitle += " Round " + (greatestDepth - depth);
        }

        // logger.info(matchTitle + " n:" +match.getMatchNumber());

        match.setMatchTitle(matchTitle);

        return greatestDepth;

    }

    private void resolveSingleBye(TournamentMatchParent tmp, TournamentMatchParent byeParent, TournamentMatchParent regParent){
        var byeUser = byeParent.getUser();
        var regUser = regParent.getUser();
        
        if (regUser != null){
            if (!tmp.getInheritsParentMatchWinner()){
                tmp.setUser(byeUser);
            }
            else {
                tmp.setUser(regUser);
            }
            tmp.setInheritsParentMatchWinner(null);
            tmp.setParentMatch(null);
        }
        else {
            tmp.setParentMatch(regParent.getParentMatch());
            tmp.setInheritsParentMatchWinner(regParent.getInheritsParentMatchWinner());
        }
    }

    private void removeByesRecursiveNew(TournamentMatch tm){

        // logger.info("remove byes recursive");

        if (tm == null){
            return;
        }

        for (var tmp: tm.getParents()){
            removeByesRecursiveNew(tmp.getParentMatch());

            if (tmp.getParentMatch() != null){
                var innerParents = tmp.getParentMatch().getParents();

                var ip1 = innerParents.get(0);
                var ip2 = innerParents.get(1);

                var user1 = ip1.getUser();
                var user2 = ip2.getUser();

                if (isBye(user1) && isBye(user2)){
                    tmp.setUser(user1);
                    tmp.setInheritsParentMatchWinner(null);
                    tmp.setParentMatch(null);
                }

                else if (isBye(user1)){
                    resolveSingleBye(tmp, ip1, ip2);
                }

                else if (isBye(user2)){
                    resolveSingleBye(tmp, ip2, ip1);
                }
            }
        }

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

    private int addTitleMatchNames(TournamentMatch match, int depth, String front){
        String matchTitle = front;

        int d1 = 0;
        int d2 = 0;

        if (match.getParentMatch1() != null && match.getInheritsParentMatch1Winner() == true){
            d1 = addTitleMatchNames(match.getParentMatch1(), depth+1, front);
        }
        if (match.getParentMatch2() != null && match.getInheritsParentMatch2Winner() == true){
            d2 = addTitleMatchNames(match.getParentMatch2(), depth+1, front);
        }

        int greatestDepth = (d1 > d2) ? d1 : d2;

        switch (depth) {
            case 1 -> matchTitle += " Finals";
            case 2 -> matchTitle += " Semifinals";
            case 3 -> matchTitle += " Quaterfinals";
            default -> matchTitle += " Round " + (greatestDepth - depth + 1);
        }

        match.setMatchTitle(matchTitle);

        return greatestDepth;

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

