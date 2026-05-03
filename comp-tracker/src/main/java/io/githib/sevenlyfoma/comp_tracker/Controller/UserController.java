package io.githib.sevenlyfoma.comp_tracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.githib.sevenlyfoma.comp_tracker.DTO.SuccessDTO;
import io.githib.sevenlyfoma.comp_tracker.DTO.UserDTO;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import io.githib.sevenlyfoma.comp_tracker.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public Iterable<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/group/{pagesize}/{pageno}")
    public Iterable<User> getPageOfUsers(@PathVariable int pagesize, @PathVariable int pageno){
        return userService.getUsersByPage(pagesize, pageno);
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id){
        return userService.getUser(id);
    }

    @PostMapping
    public ResponseEntity<SuccessDTO> createUser(@RequestBody UserDTO udto) {
        User u = userService.createUser(udto);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), ("User id:" +  u.getId() + " created")), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO udto) {
        userService.updateUser(id, udto);
        return new ResponseEntity<>(new SuccessDTO(HttpStatus.OK.value(), ("User id:" +  id + " updated")), HttpStatus.OK);
    }
}
