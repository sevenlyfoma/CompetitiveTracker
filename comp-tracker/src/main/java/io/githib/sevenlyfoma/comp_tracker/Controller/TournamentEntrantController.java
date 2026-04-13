package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.SuccessDTO;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrant;
import io.githib.sevenlyfoma.comp_tracker.Service.TournamentEntrantService;

@RestController
@RequestMapping("/api/tournament_entrants")
public class TournamentEntrantController {
    
    @Autowired
    private TournamentEntrantService tournamentEntrantService;

    @GetMapping("/{id}")
    public Iterable<TournamentEntrant> getEntrantsById(@PathVariable Long id){
        return tournamentEntrantService.getEntrantsByTournamentId(id);
    }
    
    @PutMapping("/{tid}/{uid}")
    public ResponseEntity<SuccessDTO> createTournamentEntrant(@PathVariable Long tid, @PathVariable Long uid){
        tournamentEntrantService.addEntrant(tid, uid);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), "Entrant Added"), HttpStatus.OK);

    }

    @DeleteMapping("/{tid}/{uid}")
    public ResponseEntity<SuccessDTO> deleteEntrant(@PathVariable Long tid, @PathVariable Long uid) {
        tournamentEntrantService.deleteEntrant(tid, uid);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), "Entrant Deleted"), HttpStatus.OK);

    }
}
