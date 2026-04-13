package io.githib.sevenlyfoma.comp_tracker.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchCreationObject;
import io.githib.sevenlyfoma.comp_tracker.DTO.RatingPair;
import io.githib.sevenlyfoma.comp_tracker.Exception.DuplicateUserException;
import io.githib.sevenlyfoma.comp_tracker.Exception.UserNotFoundException;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Model.MatchRepository;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import io.githib.sevenlyfoma.comp_tracker.Model.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class MatchService {
    private static final Logger logger = LoggerFactory.getLogger(MatchService.class);
    
    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingService ratingService;

    @Transactional
    public List<Match> getMatchesByUser(Long userId) {
        validateUserExists(userId);
        return matchRepository.findByUser1IdOrUser2Id(userId, userId);
    }

    @Transactional
    public Match createMatch(MatchCreationObject mco){

        validateUserExists(mco.getWinnerID());
        validateUserExists(mco.getLoserID());

        validateUsersUnique(mco.getWinnerID(), mco.getLoserID());

        User winner = userRepository.findById(mco.getWinnerID()).get();
        User loser = userRepository.findById(mco.getLoserID()).get();

        Integer winnerRatingBefore = winner.getRating();
        Integer loserRatingBefore = loser.getRating();

        RatingPair result = ratingService.getRatingChange(new RatingPair(winnerRatingBefore, loserRatingBefore));

        winner.setRating(result.winnerRating());
        loser.setRating(result.loserRating());

        userRepository.save(winner);
        userRepository.save(loser);

        Match match = Match.builder()
            .dateOfMatch(LocalDateTime.now())
            .user1(winner)
            .user2(loser)
            .winner(winner)
            .user1RatingBefore(winnerRatingBefore)
            .user1RatingAfter(winner.getRating())
            .user2RatingBefore(loserRatingBefore)
            .user2RatingAfter(loser.getRating())
            .build();

        matchRepository.save(match);

        return match;

    }


    private void validateUserExists(Long userId){
        Optional<User> u = userRepository.findById(userId);
        if (u.isEmpty()){
            logger.error("Validation failed in Match Service for User ID {}: user does not exist", userId);
            throw new UserNotFoundException("Participant in Match (User ID: " + userId + ") does not exist");
        }
    }

    private void validateUsersUnique(Long uid1, Long uid2){
        if (uid1.equals(uid2)){
            logger.error("Validation failed in Match Service for User ID {}: user can not be matched up against self", uid1);
            throw new DuplicateUserException("User cannot be part of a match against themselves");
        }
    }
}
