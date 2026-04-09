package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchCreationObject;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;

@Service
public class TournamentMatchService {
    
    private static final Logger logger = LoggerFactory.getLogger(TournamentMatchService.class);

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private MatchService matchService;

    public TournamentMatch getTMatch(Long id){
        var tournamentMatch = tournamentMatchRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return tournamentMatch;
    }

    public TournamentMatch getTournamentTopMatch(Long tournamentID){
        Tournament t = tournamentService.getTournament(tournamentID);

        List<TournamentMatch> tournamentTopMatchList = tournamentMatchRepository.findByTournamentAndMatchNumber(t, Long.valueOf(0));

        TournamentMatch topMatch = validateTopMatchPresent(t, tournamentTopMatchList);

        logger.info(topMatch.toString());
        
        return topMatch;

    }

    @Transactional
    public void processMatchResult(MatchCreationObject mco, Long matchId){
        TournamentMatch tMatch = tournamentMatchRepository.findById(matchId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament Match not found"));

        validateAllUsersPresent(tMatch);
        validateNoResult(tMatch);
        validateParticipants(tMatch, mco);
        

        User winner = tMatch.getUser2();
        User loser = tMatch.getUser1();

        if (mco.getWinnerID().equals(tMatch.getUser1().getId())){
            winner = tMatch.getUser1();
            loser = tMatch.getUser2();
        }

        Match match = matchService.createMatch(MatchCreationObject.builder().loserID(loser.getId()).winnerID(winner.getId()).build());

        tMatch.setMatchRecord(match);
        tournamentMatchRepository.save(tMatch);

        var childMatches = tournamentMatchRepository.findByParentMatch1OrParentMatch2(tMatch, tMatch);

        for (TournamentMatch c: childMatches){
            if (c.getParentMatch1() != null && c.getParentMatch1().getId().equals(tMatch.getId())){
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

    private TournamentMatch validateTopMatchPresent(Tournament t, List<TournamentMatch> tms){

        if (tms.isEmpty()){
            logger.error("Validation failed for Tournament ID {}: No matches found for this tournament", t.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tournament No Matches");
        }

        if (tms.size() > 1){
            logger.error("Validation failed for Tournament ID {}: Tournament Badly Formatted", t.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tournament Badly Formatted");
        }

        return tms.get(0);
    }

    private void validateParticipants(TournamentMatch tMatch, MatchCreationObject result) {
        Long u1 = tMatch.getUser1().getId();
        Long u2 = tMatch.getUser2().getId();
        Long winner = result.getWinnerID();
        Long loser = result.getLoserID();

        boolean winnerIsValid = winner.equals(u1) || winner.equals(u2);
        boolean loserIsValid = loser.equals(u1) || loser.equals(u2);
        boolean notPlayingThemselves = !winner.equals(loser);

        if (!winnerIsValid || !loserIsValid || !notPlayingThemselves) {
            logger.error("Validation failed for Match ID {}: One or More of the participants in result were not valid for the given Tournament Match", tMatch.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Participant mismatch");
        }
    }

    private void validateNoResult(TournamentMatch tMatch){
        if (tMatch.getMatchRecord() != null){
            logger.error("Validation failed for Match ID {}: match result has already been decided", tMatch.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Record Already Exists");
        }
    }

    private void validateAllUsersPresent(TournamentMatch tMatch){
        if (tMatch.getUser1() == null || tMatch.getUser2() == null){
            logger.error("Validation failed for Match ID {}: match does not have all required participants registered", tMatch.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing Participant");
        }
    }
}
