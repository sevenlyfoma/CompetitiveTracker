package io.githib.sevenlyfoma.comp_tracker.Model;

import org.springframework.data.repository.CrudRepository; 

public interface UserRepository extends CrudRepository<User, Long> {
    // List<User> findByName(String name);

    // User findById(long id);
}

