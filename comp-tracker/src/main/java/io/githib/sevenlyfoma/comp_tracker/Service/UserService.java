package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import io.githib.sevenlyfoma.comp_tracker.DTO.UserDTO;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import io.githib.sevenlyfoma.comp_tracker.Model.UserRepository;
import jakarta.transaction.Transactional;

@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger( UserService.class);

    @Autowired
    private RatingService ratingService;


    @Autowired
    private UserRepository userRepository;
    
    public Iterable<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUser(Long id){
        var user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return user;
    }

    @Transactional
    public User createUser(UserDTO udto){

        validateUserNameAndEmailNotTaken(udto, null);

        User u = User.builder()
            .name(udto.getName())
            .email(udto.getEmail())
            .pronouns(udto.getPronouns())
            .rating(ratingService.getInitialRating())
            .build();
        
        userRepository.save(u);


        return u;
    }

    @Transactional
    public User updateUser(Long id, UserDTO udto){

        

        User u = validateUserExists(id);
        validateUserNameAndEmailNotTaken(udto, u);

        u.setEmail(udto.getEmail());
        u.setName(udto.getName());
        u.setPronouns(udto.getPronouns());
        
        userRepository.save(u);


        return u;
    }

    private User validateUserExists(Long userId){
        Optional<User> u = userRepository.findById(userId);
        if (u.isEmpty()){
            logger.error("Validation failed in Match Service for User ID {}: user does not exist", userId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User Does Not Exist");
        }
        return u.get();
    }

    private void validateUserNameAndEmailNotTaken(UserDTO udto, User u){
        long currentID = -1;
        if (u != null){
            currentID = u.getId();
        }

        User nameUser = userRepository.findByName(udto.getName());

        if (nameUser != null && nameUser.getId() != currentID){
            logger.error("Validation failed in User Service for User name {}: name already taken by another user", udto.getName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User Name not unique");
        }

        User emailUser = userRepository.findByEmail(udto.getEmail());

        if (emailUser != null && emailUser.getId() != currentID){
            logger.error("Validation failed in User Service for User email {}: email already taken by another user", udto.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User Email not unique");
        }

    }
    
}
