package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.TournamentMatchResult;
import io.githib.sevenlyfoma.comp_tracker.Model.Tournament;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Service.TournamentMatchService;

@RestController
@RequestMapping("/api/tournament_matches")
public class TournamentMatchController {

    @Autowired
    private TournamentMatchService tournamentMatchService;
    
    private final TournamentMatchRepository tournamentMatchRepository;

    public TournamentMatchController(TournamentMatchRepository tournamentMatchRepository){
        this.tournamentMatchRepository = tournamentMatchRepository;
    }

    @GetMapping("/all")
    public Iterable<TournamentMatch> getAllTMatches() {
        return tournamentMatchRepository.findAll();
    }

    @GetMapping("/all/{tid}")
     public Iterable<TournamentMatch> getTMatchesByTId(@PathVariable Long tid){
        var t = Tournament.builder().id(tid).tournamentName(null).closed(null).build();
        var tournamentEntrantList = tournamentMatchRepository.findByTournament(t);
        return tournamentEntrantList;
    }

    @GetMapping("/top/{tid}")
     public Iterable<TournamentMatch> getTopLevelTMatchesByTId(@PathVariable Long tid){
        var t = Tournament.builder().id(tid).tournamentName(null).closed(null).build();
        var tournamentEntrantList = tournamentMatchRepository.findByTournamentAndMatchNumber(t, Long.valueOf(0));
        return tournamentEntrantList;
    }

    @GetMapping("/{mid}")
     public TournamentMatch getTopTMatchesById(@PathVariable Long mid){
        var tournamentMatch = tournamentMatchRepository.findById(mid).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return tournamentMatch;
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportMatch(@RequestBody TournamentMatchResult request) {
        tournamentMatchService.processMatchResult(request);
        return ResponseEntity.ok("Match processed and ELO updated.");
    }


}
