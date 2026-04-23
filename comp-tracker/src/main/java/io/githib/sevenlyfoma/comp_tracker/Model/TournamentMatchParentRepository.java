package io.githib.sevenlyfoma.comp_tracker.Model;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface TournamentMatchParentRepository extends CrudRepository<TournamentMatchParent, Long>{
    List<TournamentMatchParent> findByParentMatch(TournamentMatch p);
}

