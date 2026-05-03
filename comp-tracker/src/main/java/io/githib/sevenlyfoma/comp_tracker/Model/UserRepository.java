package io.githib.sevenlyfoma.comp_tracker.Model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository; 

public interface UserRepository extends CrudRepository<User, Long> {
    User findByName(String name);

    User findByEmail(String email);

    // User findById(long id);

    Page<User> findAll(Pageable pageable);
}

