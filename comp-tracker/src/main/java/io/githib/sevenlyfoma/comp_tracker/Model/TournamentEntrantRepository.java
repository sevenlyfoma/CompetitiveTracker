package io.githib.sevenlyfoma.comp_tracker.Model;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface TournamentEntrantRepository extends CrudRepository<TournamentEntrant, Long> {
    List<TournamentEntrant> findByTournament(Tournament tournament);
}

