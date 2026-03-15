package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;

@RestController
@RequestMapping("/api/tournament_matches")
public class TournamentMatchController {
    
    private final TournamentMatchRepository tournamentMatchRepository;

    public TournamentMatchController(TournamentMatchRepository tournamentMatchRepository){
        this.tournamentMatchRepository = tournamentMatchRepository;
    }

    @GetMapping("/all")
    public Iterable<TournamentMatch> getAllEntrants() {
        return tournamentMatchRepository.findAll();
    }
}
