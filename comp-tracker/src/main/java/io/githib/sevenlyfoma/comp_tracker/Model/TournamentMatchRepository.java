package io.githib.sevenlyfoma.comp_tracker.Model;

import java.util.List;

import org.springframework.data.repository.CrudRepository; 

public interface TournamentMatchRepository extends CrudRepository<TournamentMatch, Long> {
    List<TournamentMatch> findByTournament(Tournament tournament);
}

