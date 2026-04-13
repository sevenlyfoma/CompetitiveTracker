package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.githib.sevenlyfoma.comp_tracker.Exception.DuplicateTournamentEntrantException;
import io.githib.sevenlyfoma.comp_tracker.Exception.MissingTournamentEntrantException;
import io.githib.sevenlyfoma.comp_tracker.Exception.TournamentEntrantChangeAfterCloseException;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrant;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrantRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import jakarta.transaction.Transactional;

@Service
public class TournamentEntrantService {
    
    private static final Logger logger = LoggerFactory.getLogger( TournamentEntrantService.class);

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private TournamentEntrantRepository tournamentEntrantRepository;

    @Autowired
    private UserService userService;

    public List<TournamentEntrant> getEntrantsByTournamentId(Long id){

        Tournament t = tournamentService.getTournament(id);

        List<TournamentEntrant> tournamentEntrantList = tournamentEntrantRepository.findByTournament(t);

        return tournamentEntrantList;
    }

    @Transactional
    public TournamentEntrant addEntrant(Long tournamentID, Long userID){

        Tournament t = tournamentService.getTournament(tournamentID);

        User u = userService.getUser(userID);

        validateUserNotInTournament(t, u);
        validateIsNotClosed(t);

        TournamentEntrant te = TournamentEntrant.builder().tournament(t).user(u).build();

        tournamentEntrantRepository.save(te);

        return te;
    }

    @Transactional
    public void deleteEntrant(Long tournamentID, Long userID){

        Tournament t = tournamentService.getTournament(tournamentID);

        User u = userService.getUser(userID);

        TournamentEntrant te = validateUserInTournament(t, u);
        validateIsNotClosed(t);

        tournamentEntrantRepository.delete(te);


    }

    private void validateIsNotClosed(Tournament t){
        if (t.getClosed()){
            logger.error("Validation failed for Tournament ID {}: Entrants cant be changed when Tournament is already closed", t.getId());
            throw new TournamentEntrantChangeAfterCloseException("Entrants cannot be changed when tournament is already closed");
        }
    }

    private void validateUserNotInTournament(Tournament t, User u){

        TournamentEntrant tes = tournamentEntrantRepository.findByTournamentAndUser(t, u);

        if (tes != null){
            logger.error("Validation failed for Tournament ID {} and User ID {}: A user cannot be entered into the same tournament multiple times", t.getId(), u.getId());
            throw new DuplicateTournamentEntrantException("A user cannot be entered into the same tournament twice");
        }

       
    }

    private TournamentEntrant validateUserInTournament(Tournament t, User u){

        TournamentEntrant tes = tournamentEntrantRepository.findByTournamentAndUser(t, u);

        if (tes == null){
            logger.error("Validation failed for Tournament ID {} and User ID {}: A user cannot be deleted from a tournament it is not enrolled in", t.getId(), u.getId());
            throw new MissingTournamentEntrantException("User cannot be deleted from a tournament it is not in");
        }

        return tes;

       
    }

}
