package io.githib.sevenlyfoma.comp_tracker.Controller;

import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.SuccessDTO;
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
    public ResponseEntity<SuccessDTO> createTournament(@RequestBody TournamentDTO tdto) throws URISyntaxException {
        Tournament savedTournament = tournamentService.createTournament(tdto);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), ("Tournament id:" + savedTournament.getId() + " Created")), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessDTO> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), ("Tournament id:" +id + " deleted")), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessDTO> updateTournament(@PathVariable Long id, @RequestBody TournamentDTO tdto) {
        tournamentService.updateTournament(tdto, id);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), ("Tournament id:" +id + " updated")), HttpStatus.OK);
    }

    @PutMapping("/close/{tournamentId}")
    public ResponseEntity<SuccessDTO> closeTournament(@PathVariable long tournamentId) {
        tournamentService.closeTournament(tournamentId);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), "Tournament Successfully Closed"), HttpStatus.OK);
    }
}
