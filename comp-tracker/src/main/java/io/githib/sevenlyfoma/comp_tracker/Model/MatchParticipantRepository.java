package io.githib.sevenlyfoma.comp_tracker.Model;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface MatchParticipantRepository extends CrudRepository<MatchParticipant, Long>{
    List<MatchParticipant> findByUserId(Long id);
}

