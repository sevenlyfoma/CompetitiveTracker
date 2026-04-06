package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrant;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrantRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;

@Service
public class TournamentService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentMatchService.class);
    
    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Autowired
    private TournamentEntrantRepository tournamentEntrantRepository;

    @Transactional
    public void closeTournament(long tournamentID){
        var t = tournamentRepository.findById(tournamentID).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));
        var entrants = tournamentEntrantRepository.findByTournament(t);

        // for (TournamentEntrant e: entrants){
        //     logger.info(e.getUser().getName() + " " + e.getUser().getRating().toString());
        // }

        // logger.info(entrants.toString());

        List<User> sortedUsers = entrants.stream()
            .sorted(Comparator.comparing(entrant -> entrant.getUser().getRating()))
            .map(TournamentEntrant::getUser)
            .collect(Collectors.toList());

        // for (User u: sortedUsers){
        //     logger.info(u.getName() + " " + u.getRating().toString());
        // }

        var leng = sortedUsers.size();
        var closestPowerOfTwo = Integer.highestOneBit(leng);
        var difference = leng - closestPowerOfTwo;

        logger.info(Integer.toString(leng) + " " + Integer.toString(closestPowerOfTwo) + " " + Integer.toString(difference));

        // List<TournamentMatch> tournamentMatches = new ArrayList<>();

        for (int i = 0; i < closestPowerOfTwo*2 - leng; i++){
            var u = User.builder().name("bye").email("x"+i).rating(0).build();
            sortedUsers.add(0, u);
        }

        for (User u: sortedUsers){
            logger.info(u.getId() + " " + u.getName() + " " + u.getRating().toString());
        }

        List<TournamentMatch> tms = generateSingleElimBracket(sortedUsers, t);

        for (TournamentMatch tm: tms){
            tournamentMatchRepository.save(tm);
        }

        t.setClosed(true);

        tournamentRepository.save(t);

    }

    public List<TournamentMatch> generateSingleElimBracket(List<User> users, Tournament t){

        List<TournamentMatch> tms = new ArrayList<>();

        for (int i = 0; i < users.size()/2; i++){
            User user1 = users.get(i);
            User user2 = users.get(users.size()-1-i);
            TournamentMatch tm = TournamentMatch.builder()
                .tournament(t)
                .user1(user1)
                .user2(user2)
                .matchTitle("Match in Round of " + users.size())
                .matchNumber( ((long) Integer.numberOfTrailingZeros(users.size())) )
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
                    .matchTitle("Match in Round of " + sortedTMs.size())
                    .user1(byeUser1)
                    .user2(byeUser2)
                    .parentMatch1(p1)
                    .parentMatch2(p2)
                    .inheritsParentMatch1Winner(p1InheritsWinner)
                    .inheritsParentMatch2Winner(p2InheritsWinner)
                    .matchNumber( ((long) Integer.numberOfTrailingZeros(sortedTMs.size())) )
                    .build();

                logger.info(tm.getMatchNumber().toString());

                tms.add(tm);
            }

            totalTMs.addAll(tms);

            
        }




        return totalTMs;
    }

    public User findExpectedWinner(TournamentMatch tm){
        User u;

        User u1 = tm.getUser1();
        User u2 = tm.getUser2();

        if (u1 == null){
            u1 = findExpectedWinner(tm.getParentMatch1());
        }
        if (u2 == null) {
            u2 = findExpectedWinner(tm.getParentMatch2());
        }

        if (u1.getRating() > u2.getRating()){
            u = u1;
        }
        else{
            u = u2;
        }

        return u;
    }

    public List<TournamentMatch> fillOutBracketRecursive(List<TournamentMatch> tms){

        return null;
    }
}

