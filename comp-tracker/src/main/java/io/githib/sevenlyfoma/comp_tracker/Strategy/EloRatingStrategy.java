package io.githib.sevenlyfoma.comp_tracker.Strategy;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component("eloStrategy")
public class EloRatingStrategy implements RatingStrategy {
    @Override
    public Integer getInitialRating() { return 1000; }

    @Override
    public String getSystemName() { return "ELO"; }

    @Override
    public List<Integer> getRatingChange(List<Integer> ratingsBefore, List<Integer> points) {
        int kFactor = 32;

        List<Integer> newRatings = new ArrayList<>();

        for (int i = 0; i < ratingsBefore.size(); i++){
            int r1 = ratingsBefore.get(i);
            int score1 = points.get(i);

            int newRating = r1;


            for (int j = 0; j < ratingsBefore.size(); j++){
                if (i != j){
                    int r2 = ratingsBefore.get(j);
                    int score2 = points.get(j);
                    double expectedScore = 1.0 / (1.0 + Math.pow(10, (r2 - r1) / 400.0));

                    double pointsScored = 0.5;//Default assume draw
                    
                    if (score1 != score2){
                        pointsScored = score1;
                    }

                    newRating += (int) Math.round(kFactor * (pointsScored - expectedScore));



                }
            }
            newRatings.add(newRating);
        }

        return newRatings;
    }
}