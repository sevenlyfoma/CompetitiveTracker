package io.githib.sevenlyfoma.comp_tracker.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.githib.sevenlyfoma.comp_tracker.Strategy.RatingStrategy;

@Service
public class RatingService {

    private final RatingStrategy activeStrategy;

    public RatingService(Map<String, RatingStrategy> strategies, @Value("${rating.system.type}") String strategyName) {

        this.activeStrategy = strategies.get(strategyName);
        
        if (this.activeStrategy == null) {
            throw new IllegalArgumentException("Invalid rating system configured: " + strategyName);
        }
    }

    public Integer getInitialRating() {
        return activeStrategy.getInitialRating();
    }

    public List<Integer> getRatingChange(List<Integer> ratingsBefore, List<Integer> points){
        return activeStrategy.getRatingChange(ratingsBefore, points);
    }
}
