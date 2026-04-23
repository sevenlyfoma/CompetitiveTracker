package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchResultDTO;
import io.githib.sevenlyfoma.comp_tracker.Exception.NoTournamentMatchesFoundException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentBadlyFormattedException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentMatchAlreadyDecidedException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentMatchMissingParticipantsException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentMatchResultParticipantNotValidException;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Model.MatchParticipant;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchParent;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchParentRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;

@Service
public class TournamentMatchService {
    
    private static final Logger logger = LoggerFactory.getLogger(TournamentMatchService.class);

    @Autowired
    private TournamentMatchRepository tournamentMatchRepository;

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private MatchService matchService;

    @Autowired
    private TournamentMatchParentRepository tournamentMatchParentRepository;

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
    public void processMatchResult(MatchResultDTO mrdto, Long matchId){

        TournamentMatch tMatch = tournamentMatchRepository.findById(matchId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament Match not found"));

        validateAllUsersPresent(tMatch);
        validateNoResult(tMatch);
        validateParticipants(tMatch, mrdto);
    

        Match match = matchService.createMatch(mrdto);

        tMatch.setMatchRecord(match);
        tournamentMatchRepository.save(tMatch);

        var childMatches = tournamentMatchParentRepository.findByParentMatch(tMatch);

        for (TournamentMatchParent c: childMatches){
            for (MatchParticipant mp: match.getParticipants()){
                if (c.getInheritsParentMatchWinner() && mp.getPoints() == 1){
                    c.setUser(mp.getUser());
                }
                else if (!c.getInheritsParentMatchWinner() && mp.getPoints() == 0){
                    c.setUser(mp.getUser());
                }
            }
            tournamentMatchParentRepository.save(c);
        }
    }

    private TournamentMatch validateTopMatchPresent(Tournament t, List<TournamentMatch> tms){

        if (tms.isEmpty()){
            logger.error("Validation failed for Tournament ID {}: No matches found for this tournament", t.getId());
            throw new NoTournamentMatchesFoundException("No matches found for tournament id" + t.getId());
        }

        if (tms.size() > 1){
            logger.error("Validation failed for Tournament ID {}: Tournament Badly Formatted", t.getId());
            throw new TournamentBadlyFormattedException("Tournament is badly formatted in database");
        }

        return tms.get(0);
    }

    //TODO validate total points in MatchResultObject add up to one, maybe do this in match service

    private void validateParticipants(TournamentMatch tMatch, MatchResultDTO mrdto) {

        List<Long> tMatchUsers = tMatch.getParents().stream()
            .map(x -> x.getUser().getId())
            .sorted()
            .collect(Collectors.toList());

        List<Long> resultIds = mrdto.getUserIds().stream()
            .sorted()
            .collect(Collectors.toList());

        for (int i = 0; i < tMatchUsers.size(); i++){
            if (!tMatchUsers.get(i).equals(resultIds.get(i))){
                logger.error("Validation failed for TMatch ID {}: Result participants did not match assinged participants", tMatch.getId());
                throw new TournamentMatchResultParticipantNotValidException("RResult participants did not match assinged participants");
            }
        }  
    }
    private void validateNoResult(TournamentMatch tMatch){
        if (tMatch.getMatchRecord() != null){
            logger.error("Validation failed for Match ID {}: match result has already been decided", tMatch.getId());
            throw new TournamentMatchAlreadyDecidedException("Tournament Match Result has already been decided");
        }
    }

    private void validateAllUsersPresent(TournamentMatch tMatch){
        if (tMatch.getParents().size() != tMatch.getNumberOfParticipants()){
            logger.error("Validation failed for Match ID {}: match does not have all required participants registered", tMatch.getId());
            throw new TournamentMatchMissingParticipantsException("Match Cannot Be resolved, not all participants have been decided");
        }
    }
}
