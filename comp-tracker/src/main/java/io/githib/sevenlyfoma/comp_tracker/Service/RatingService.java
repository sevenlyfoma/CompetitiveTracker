package io.githib.sevenlyfoma.comp_tracker.Service;

import org.springframework.stereotype.Service;

import io.githib.sevenlyfoma.comp_tracker.DTO.RatingPair;

@Service
public class RatingService {

    public Integer getInitialRating(){
        return getInitialRatingElo();
    }

    private Integer getInitialRatingElo(){
        return 1000;
    }


    public RatingPair getRatingChange(RatingPair beforePair){
        return getRatingChangeElo(beforePair);
    }


    private RatingPair getRatingChangeElo(RatingPair beforePair){
        
        int kFactor = 32;
        double expectedScore = 1.0 / (1.0 + Math.pow(10, (beforePair.loserRating() - beforePair.winnerRating()) / 400.0));
        int eloChange = (int) Math.round(kFactor * (1 - expectedScore));

        Integer winnerEloAfter = beforePair.winnerRating() + eloChange;
        Integer loserEloAfter = beforePair.loserRating() - eloChange;


        return new RatingPair(winnerEloAfter, loserEloAfter);

    }

}
