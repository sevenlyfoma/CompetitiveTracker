package io.githib.sevenlyfoma.comp_tracker.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.githib.sevenlyfoma.comp_tracker.DTO.MatchResultDTO;
import io.githib.sevenlyfoma.comp_tracker.Exception.MatchAgainstSelfException;
import io.githib.sevenlyfoma.comp_tracker.Exception.MatchParticipantNotFoundException;
import io.githib.sevenlyfoma.comp_tracker.Model.Match;
import io.githib.sevenlyfoma.comp_tracker.Model.MatchParticipant;
import io.githib.sevenlyfoma.comp_tracker.Model.MatchParticipantRepository;
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
    private MatchParticipantRepository matchParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingService ratingService;

    @Transactional
    public List<Match> getMatchesByUser(Long userId) {
        validateUserExists(userId);

        List<MatchParticipant> mps = matchParticipantRepository.findByUserId(userId);

        return mps.stream().map(x -> x.getMatch())
            .collect(Collectors.toList());

        // return matchRepository.findByUser1IdOrUser2Id(userId, userId);
    }

    @Transactional
    public Match createMatch(MatchResultDTO mrdto){

        List<User> users = new ArrayList<>();
        List<Integer> ratingsBefore = new ArrayList<>();
        for (int i = 0; i < mrdto.getUserIds().size(); i++){
            User u = validateUserExists(mrdto.getUserIds().get(i));
            for (int j = 0; j < mrdto.getUserIds().size(); j++){
                if (i != j){
                    validateUsersUnique(mrdto.getUserIds().get(i), mrdto.getUserIds().get(j));
                }
                
            }
            users.add(u);
            ratingsBefore.add(u.getRating());
        }

        List<Integer> results = ratingService.getRatingChange(ratingsBefore, mrdto.getPoints());

        for (int i = 0; i < users.size(); i++){
            var u = users.get(i);
            u.setRating(results.get(i));
            userRepository.save(u);
        }


        Match match = Match.builder()
            .dateOfMatch(LocalDateTime.now())
            .build();

        matchRepository.save(match);

        List<MatchParticipant> mps = new ArrayList<>();

        for (int i = 0; i < users.size(); i++){
            MatchParticipant mp = MatchParticipant.builder()
            .match(match)
            .user(users.get(i))
            .ratingBefore(ratingsBefore.get(i))
            .ratingAfter(results.get(i))
            .points(mrdto.getPoints().get(i))
            .build();

            matchParticipantRepository.save(mp);

            mps.add(mp);
        }

        match.setParticipants(mps);

        return match;

    }

    private User validateUserExists(Long userId){
        Optional<User> u = userRepository.findById(userId);
        if (u.isEmpty()){
            logger.error("Validation failed in Match Service for User ID {}: user does not exist", userId);
            throw new MatchParticipantNotFoundException("Participant in Match (User ID: " + userId + ") does not exist");
        }
        return u.get();
    }

    private void validateUsersUnique(Long uid1, Long uid2){
        if (uid1.equals(uid2)){
            logger.error("Validation failed in Match Service for User ID {}: user can not be matched up against self", uid1);
            throw new MatchAgainstSelfException("User cannot be part of a match against themselves");
        }
    }
}
