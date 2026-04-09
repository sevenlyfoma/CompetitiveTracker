package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchCreationObject;
import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Service.TournamentMatchService;

@RestController
@RequestMapping("/api/tournament_matches")
public class TournamentMatchController {

    @Autowired
    private TournamentMatchService tournamentMatchService;

    @GetMapping("/top/{tid}")
     public TournamentMatch getTopLevelTMatchesByTId(@PathVariable Long tid){
        var topMatch = tournamentMatchService.getTournamentTopMatch(tid);
        return topMatch;
    }

    @GetMapping("/{mid}")
     public TournamentMatch getTopTMatchesById(@PathVariable Long mid){
        return tournamentMatchService.getTMatch(mid);
    }

    @PutMapping("/report/{mid}")
    public ResponseEntity<String> reportMatch(@RequestBody MatchCreationObject mco, Long mid) {
        tournamentMatchService.processMatchResult(mco, mid);
        return ResponseEntity.ok("Match processed and ELO updated.");
    }


}
