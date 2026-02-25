package io.githib.sevenlyfoma.comp_tracker;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

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

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchRepository matchRepository;

    public MatchController(MatchRepository matchRepository){
        this.matchRepository = matchRepository;
    }

    @GetMapping("/all")
    public Iterable<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/all/{userId}")
    public List<Match> getMatchesByUser(@PathVariable Long userId) {
        return matchRepository.findByUser1IdOrUser2Id(userId, userId);
    }

    @GetMapping("/wins/{userId}")
    public List<Match> getWinsByUser(@PathVariable Long userId) {
        return matchRepository.findByWinnerId(userId);
    }

    @GetMapping("/{id}")
    public Match getUser(@PathVariable Long id){
        var match = matchRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return match;
    }

    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestBody Match match) throws URISyntaxException {
        Match savedMatch = matchRepository.save(match);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedMatch.getId())
            .toUri();

        return ResponseEntity.created(location).body(savedMatch);
    
        //return ResponseEntity.created(new URI("/matches/" + savedMatch.getId())).body(savedMatch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatcg(@PathVariable Long id) {
        matchRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match match) {
        Match currentMatch = matchRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        currentMatch.setDateOfMatch(match.getDateOfMatch());
        currentMatch.setUser1(match.getUser1());
        currentMatch.setUser2(match.getUser2());
        currentMatch.setWinner(match.getWinner());
        currentMatch.setUser1RatingBefore(match.getUser1RatingBefore());
        currentMatch.setUser1RatingAfter(match.getUser1RatingAfter());
        currentMatch.setUser2RatingBefore(match.getUser2RatingBefore());
        currentMatch.setUser2RatingAfter(match.getUser2RatingAfter());
        currentMatch = matchRepository.save(currentMatch);

        return ResponseEntity.ok(currentMatch);
    }
    
}
