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

        for (User u: sortedUsers){
            logger.info(u.getName() + " " + u.getRating().toString());
        }

        var leng = sortedUsers.size();
        var closestPowerOfTwo = Integer.highestOneBit(leng);
        var difference = leng - closestPowerOfTwo;

        logger.info(Integer.toString(leng) + " " + Integer.toString(closestPowerOfTwo) + " " + Integer.toString(difference));

        List<TournamentMatch> tournamentMatches = new ArrayList<TournamentMatch>();

        //Lowest seeds fighting to be allowed in the round of N
        for (int i = 0; i < difference; i++){
            User user1 = sortedUsers.get(i);
            User user2 = sortedUsers.get(i);

            TournamentMatch tm = TournamentMatch.builder().tournament(t).user1(user1).user2(user2).matchTitle("Match to Enter Round of " + Integer.toString(closestPowerOfTwo)).build();
        
            tournamentMatches.add(tm);

            User highSeedUser = sortedUsers.get(leng-1-i);

            TournamentMatch tm2 = TournamentMatch.builder()
                .tournament(t)
                .user1(highSeedUser)
                .parentMatch2(tm)
                .inheritsParentMatch2Winner(true)
                .matchTitle("Match in Round of " + Integer.toString(closestPowerOfTwo))
                .build();

             tournamentMatches.add(tm2);
        }

        // logger.info("Hello");


        // // From difference *2 to leng - diffence
        // for (int j = (difference*2); j < (leng - difference) ; j++ ){

        // }
        
    }

}
