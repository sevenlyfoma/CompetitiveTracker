package io.githib.sevenlyfoma.comp_tracker.Strategy;

import io.githib.sevenlyfoma.comp_tracker.DTO.RatingPair;

public interface RatingStrategy {
    Integer getInitialRating();
    RatingPair getRatingChange(RatingPair beforePair);
    String getSystemName();
}