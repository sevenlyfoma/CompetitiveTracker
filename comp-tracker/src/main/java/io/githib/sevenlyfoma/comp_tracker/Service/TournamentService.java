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
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchParent;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchParentRepository;
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

        if (leng != closestPowerOfTwo){
            for (int i = 0; i < closestPowerOfTwo*2 - leng; i++){
                 var u = User.builder().name("bye").email("x"+i).rating(0).build();
                sortedUsers.add(0, u);
            }
        }
        
        if (t.getStyle().equals("single")){
            var gf = generateSingleElimBracket(sortedUsers, t);
            saveRecursive(gf);
        }
        else {
            var gf = generateDoubleElimBracket(sortedUsers, t);
            saveRecursive(gf);
        }


        t.setClosed(true);

        tournamentRepository.save(t);

    }

    private TournamentMatch generateSingleElimBracket(List<User> users, Tournament t){

        List<TournamentMatch> winnerTms = new ArrayList<>();


        //Generate first set of matches
        //We will append missing fields later
        for (int i = 0; i < users.size()/2; i++){

            User u1 = users.get(i);
            User u2 = users.get(users.size()-1-i);

            TournamentMatch tm = generateTM(t, Arrays.asList(u1, u2), Arrays.asList(null, null), Arrays.asList(null, null));

            winnerTms.add(tm);
        }

        List<TournamentMatch> sortedWinnerTms = sortByExpectedWinner(winnerTms);
        

        while (sortedWinnerTms.size() > 1){
            winnerTms = new ArrayList<>();

            for (int i = 0; i < sortedWinnerTms.size()/2; i++){
                var tm1 = sortedWinnerTms.get(i);
                var tm2 = sortedWinnerTms.get(sortedWinnerTms.size()-1-i);

                TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(true, true));

                winnerTms.add(tm);
                
            }

            sortedWinnerTms =  sortByExpectedWinner(winnerTms);
            
        }

        var winnerFinal = winnerTms.get(0);

        removeByesRecursive(winnerFinal);
        addMatchNumbers(winnerFinal, 1);
        winnerFinal.setMatchNumber(0L);
        addTitleMatchNames(winnerFinal, 1, "");


        return winnerFinal;

    }

    private TournamentMatch generateDoubleElimBracket(List<User> users, Tournament t){

        List<TournamentMatch> winnerTms = new ArrayList<>();

        List<TournamentMatch> loserTms = new ArrayList<>();


        //Generate first set of matches
        //We will append missing fields later
        for (int i = 0; i < users.size()/2; i++){

            User u1 = users.get(i);
            User u2 = users.get(users.size()-1-i);

            TournamentMatch tm = generateTM(t, Arrays.asList(u1, u2), Arrays.asList(null, null), Arrays.asList(null, null));

            winnerTms.add(tm);
        }

        List<TournamentMatch> sortedWinnerTms = sortByExpectedWinner(winnerTms);
        
        //Generate first set of losers Matches
        for (int i = 0; i < sortedWinnerTms.size()/2; i++){
            var tm1 = sortedWinnerTms.get(i);
            var tm2 = sortedWinnerTms.get(sortedWinnerTms.size()-1-i);

            TournamentMatch tm = generateTM(t, Arrays.asList(null, null), Arrays.asList(tm1, tm2), Arrays.asList(false, false));

            loserTms.add(tm);
                
        }

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
            }
            
            if (!tempLosers.isEmpty()){
                loserTms = tempLosers;
            }

            sortedWinnerTms =  sortByExpectedWinner(winnerTms);
            
        }

        // logger.info("" + winnerTms.size());
        // logger.info("" + loserTms.size());
        var winnerFinal = winnerTms.get(0);
        var loserFinal = loserTms.get(0);

        TournamentMatch grandfinal = generateTM(t, Arrays.asList(null, null), Arrays.asList(winnerFinal, loserFinal), Arrays.asList(true, true));


        removeByesRecursive(grandfinal);
        addMatchNumbersDouble(grandfinal);
        addTitleMatchNamesDouble(grandfinal);

        // return cleanTMs;

        return grandfinal;

        // return totalTms;
    }

    private void saveRecursive(TournamentMatch m){

        if (m == null){
            return;
            
        }
        if (m.getParents() != null){
            for (var tmp: m.getParents()){
                saveRecursive(tmp.getParentMatch());
            }
        }
        

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
    
    private void addMatchNumbersDouble(TournamentMatch finalMatch){
        TournamentMatch winnersFinal = finalMatch.getParents().get(0).getParentMatch();

        addMatchNumbers(winnersFinal, 1);

        TournamentMatch losersFinal = finalMatch.getParents().get(1).getParentMatch();

        addMatchNumbers(losersFinal, winnersFinal.getMatchNumber().intValue());


        finalMatch.setMatchNumber(0L);

    }

    private void addMatchNumbers(TournamentMatch finalMatch, int modifier){

        LinkedList<TournamentMatch> queue = new LinkedList<>();

        List<TournamentMatch> traversedMatches = new ArrayList<>();

        queue.add(finalMatch);

        while (!queue.isEmpty()){
            TournamentMatch current = queue.remove();

            if (current != null){
                 for (int i = 0; i < current.getParents().size(); i++){

                    var x = current.getParents().get(current.getParents().size() - i - 1);
                    if (x.getInheritsParentMatchWinner() != null && x.getInheritsParentMatchWinner() == true){
                        queue.add(x.getParentMatch());
                    }
                    
                }

                traversedMatches.add(current);
            }

           
        }


        for (int i = 0; i < traversedMatches.size(); i++){
            TournamentMatch tm = traversedMatches.get(traversedMatches.size()-1-i);

            tm.setMatchNumber((long) (i+modifier));
        }




    }

    private void addTitleMatchNamesDouble(TournamentMatch match){
        match.setMatchTitle("Grand Finals");

        addTitleMatchNames(match.getParents().get(0).getParentMatch(), 1, "Winner's ");

        addTitleMatchNames(match.getParents().get(1).getParentMatch(), 1, "Loser's ");
    }

    private int addTitleMatchNames(TournamentMatch match, int depth, String front){
        if (match == null){
            return depth;
        }

        String matchTitle = front;

        List<Integer> depths = new ArrayList<>();

        for (var tmps: match.getParents()){
            if (tmps != null && tmps.getInheritsParentMatchWinner() != null && tmps.getInheritsParentMatchWinner()){
                depths.add(addTitleMatchNames(tmps.getParentMatch(), depth+1, front));
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

    private void removeByesRecursive(TournamentMatch tm){

        // logger.info("remove byes recursive");

        if (tm == null){
            return;
        }

        for (var tmp: tm.getParents()){
            removeByesRecursive(tmp.getParentMatch());

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

    private Boolean isBye(User u){
        return (u != null && u.getId() == null);
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

