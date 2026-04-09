package io.githib.sevenlyfoma.comp_tracker.Strategy;

import org.springframework.stereotype.Component;

import io.githib.sevenlyfoma.comp_tracker.DTO.RatingPair;

@Component("eloStrategy")
public class EloRatingStrategy implements RatingStrategy {
    @Override
    public Integer getInitialRating() { return 1000; }

    @Override
    public RatingPair getRatingChange(RatingPair pair) {
        int kFactor = 32;
        double expectedScore = 1.0 / (1.0 + Math.pow(10, (pair.loserRating() - pair.winnerRating()) / 400.0));
        int eloChange = (int) Math.round(kFactor * (1 - expectedScore));

        Integer winnerEloAfter = pair.winnerRating() + eloChange;
        Integer loserEloAfter = pair.loserRating() - eloChange;


        return new RatingPair(winnerEloAfter, loserEloAfter);
    }

    @Override
    public String getSystemName() { return "ELO"; }
}