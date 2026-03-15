package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
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
    public Iterable<TournamentMatch> getAllTMatches() {
        return tournamentMatchRepository.findAll();
    }

    @GetMapping("/{tid}")
     public Iterable<TournamentMatch> getTMatchesByTId(@PathVariable Long tid){
        var t = Tournament.builder().id(tid).tournamentName(null).closed(null).build();
        var tournamentEntrantList = tournamentMatchRepository.findByTournament(t);
        return tournamentEntrantList;
    }


}
