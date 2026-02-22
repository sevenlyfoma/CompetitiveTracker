package io.githib.sevenlyfoma.comp_tracker;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public List<User> getAllUsers(){
        Iterable<User> users = userRepository.findAll();

        List<User> target = new ArrayList<>();
        users.forEach(target::add);

        return target;
    }
    
}
