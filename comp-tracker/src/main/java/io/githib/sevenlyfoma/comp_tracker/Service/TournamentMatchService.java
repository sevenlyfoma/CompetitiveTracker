package io.githib.sevenlyfoma.comp_tracker.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.TournamentMatchResult;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Model.MatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import io.githib.sevenlyfoma.comp_tracker.Model.UserRepository;

@Service
public class TournamentMatchService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Transactional
    public void processMatchResult(TournamentMatchResult result){
        TournamentMatch tMatch = tournamentMatchRepository.findById(result.getTournamentMatchID()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament Match not found"));

        User winner = tMatch.getUser2();
        User loser = tMatch.getUser1();

        if (result.getWinnerID().equals(tMatch.getUser1().getId())){
            winner = tMatch.getUser1();
            loser = tMatch.getUser2();
        }

        int kFactor = 32;
        double expectedScore = 1.0 / (1.0 + Math.pow(10, (loser.getRating() - winner.getRating()) / 400.0));
        int eloChange = (int) Math.round(kFactor * (1 - expectedScore));

        int winnerEloBefore = winner.getRating();
        int loserEloBefore = loser.getRating();

        winner.setRating(winner.getRating() + eloChange);
        loser.setRating(loser.getRating() - eloChange);

        userRepository.save(winner);
        userRepository.save(loser);

        Match match = Match.builder().dateOfMatch(LocalDateTime.now())
            .user1(winner)
            .user2(loser)
            .winner(winner)
            .user1RatingBefore(winnerEloBefore)
            .user1RatingAfter(winner.getRating())
            .user2RatingBefore(loserEloBefore)
            .user2RatingAfter(loser.getRating())
            .build();

        
        matchRepository.save(match);

        tMatch.setMatchRecord(match);
        tournamentMatchRepository.save(tMatch);

        var childMatches = tournamentMatchRepository.findByParentMatch1OrParentMatch2(tMatch, tMatch);

        for (TournamentMatch c: childMatches){
            if (c.getParentMatch1().getId().equals(tMatch.getId())){
                if (c.getInheritsParentMatch1Winner()){
                    c.setUser1(winner);
                }
                else {
                    c.setUser1(loser);
                }
            }
            else {
                if (c.getInheritsParentMatch2Winner()){
                    c.setUser2(winner);
                }
                else {
                    c.setUser2(loser);
                }
            }
            tournamentMatchRepository.save(c);
        }
    }
}
