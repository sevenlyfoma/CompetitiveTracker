package io.githib.sevenlyfoma.comp_tracker.Model;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface  MatchRepository extends CrudRepository<Match, Long>{
    List<Match> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);

    List<Match> findByWinnerId(Long winnerId);
}
