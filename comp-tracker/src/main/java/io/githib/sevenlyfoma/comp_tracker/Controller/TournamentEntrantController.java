package io.githib.sevenlyfoma.comp_tracker.Controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrant;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentEntrantRepository;

@RestController
@RequestMapping("/api/tournament_entrants")
public class TournamentEntrantController {
    
    private final TournamentEntrantRepository tournamentEntrantRepository;

    public TournamentEntrantController(TournamentEntrantRepository tournamentEntrantRepository){
        this.tournamentEntrantRepository = tournamentEntrantRepository;
    }

    @GetMapping("/all")
    public Iterable<TournamentEntrant> getAllEntrants() {
        return tournamentEntrantRepository.findAll();
    }

    @GetMapping("/{id}")
    public Iterable<TournamentEntrant> getEntrantsById(@PathVariable Long id){
        var t = Tournament.builder().id(id).tournamentName(null).closed(null).build();
        var tournamentEntrantList = tournamentEntrantRepository.findByTournament(t);
        return tournamentEntrantList;
    }

    @PostMapping
    public ResponseEntity<TournamentEntrant> createTournamentEntrant(@RequestBody TournamentEntrant tournamentEntrant) throws URISyntaxException {
        TournamentEntrant savedTournamentEntrant = tournamentEntrantRepository.save(tournamentEntrant);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedTournamentEntrant.getTournament().getId())
            .toUri();

        return ResponseEntity.created(location).body(savedTournamentEntrant);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteEntrant(@RequestBody TournamentEntrant tournamentEntrant) throws URISyntaxException {
        tournamentEntrantRepository.delete(tournamentEntrant);
        return ResponseEntity.ok().build();
    }
}
