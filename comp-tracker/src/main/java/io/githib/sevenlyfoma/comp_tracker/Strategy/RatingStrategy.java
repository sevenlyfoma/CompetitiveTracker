package io.githib.sevenlyfoma.comp_tracker.Strategy;

import java.util.List;

public interface RatingStrategy {
    Integer getInitialRating();
    String getSystemName();
    List<Integer> getRatingChange(List<Integer> ratingsBefore, List<Integer> points);
}