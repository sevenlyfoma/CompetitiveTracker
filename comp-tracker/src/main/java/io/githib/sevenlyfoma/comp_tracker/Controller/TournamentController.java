package io.githib.sevenlyfoma.comp_tracker.Controller;

import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.TournamentDTO;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Service.TournamentService;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @GetMapping("/all")
    public Iterable<Tournament> getAllTournamentes() {
        return tournamentService.getAllTournaments();
    }

    @GetMapping("/{id}")
    public Tournament getUser(@PathVariable Long id){
        return tournamentService.getTournament(id);
    }

    @PostMapping
    public ResponseEntity<String> createTournament(@RequestBody TournamentDTO tdto) throws URISyntaxException {
        Tournament savedTournament = tournamentService.createTournament(tdto);
        return ResponseEntity.ok("Tournament id:" + savedTournament.getId() + " Created");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.ok("Tournament id:" +id + " deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTournament(@PathVariable Long id, @RequestBody TournamentDTO tdto) {
        tournamentService.updateTournament(tdto, id);

        return ResponseEntity.ok("Tournament id:" +id + " updated");
    }

    @PostMapping("/close/{tournamentId}")
    public ResponseEntity<String> closeTournament(@PathVariable long tournamentId) {
        tournamentService.closeTournament(tournamentId);
        return ResponseEntity.ok("Tournament Closed, Tournament Matches Created");
    }
}
