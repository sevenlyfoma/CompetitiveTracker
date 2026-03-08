package io.githib.sevenlyfoma.comp_tracker.Controller;

import java.net.URI;
import java.net.URISyntaxException;

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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentRepository;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {
    
    private final TournamentRepository tournamentRepository;

    public TournamentController(TournamentRepository tournamentRepository){
        this.tournamentRepository = tournamentRepository;
    }

    @GetMapping("/all")
    public Iterable<Tournament> getAllTournamentes() {
        return tournamentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Tournament getUser(@PathVariable Long id){
        var tournament = tournamentRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return tournament;
    }

    @PostMapping
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) throws URISyntaxException {
        Tournament savedTournament = tournamentRepository.save(tournament);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedTournament.getId())
            .toUri();

        return ResponseEntity.created(location).body(savedTournament);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatcg(@PathVariable Long id) {
        tournamentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long id, @RequestBody Tournament tournament) {
        Tournament currentTournament = tournamentRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        currentTournament.setTournamentName(tournament.getTournamentName());
        currentTournament.setClosed(tournament.getClosed());
        currentTournament = tournamentRepository.save(currentTournament);

        return ResponseEntity.ok(currentTournament);
    }
}
