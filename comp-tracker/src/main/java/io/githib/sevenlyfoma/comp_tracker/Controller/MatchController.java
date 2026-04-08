package io.githib.sevenlyfoma.comp_tracker.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchCreationObject;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Service.MatchService;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping("/all/{userId}")
    public List<Match> getMatchesByUser(@PathVariable Long userId) {
        return matchService.getMatchesByUser(userId);
    }

    @PostMapping("/report")
    public ResponseEntity<String> createMatch(@RequestBody MatchCreationObject mco) {
        Match match = matchService.createMatch(mco);
        return ResponseEntity.ok("Match id:" +  match.getId() + " created and ELO updated.");
    }
    
}
