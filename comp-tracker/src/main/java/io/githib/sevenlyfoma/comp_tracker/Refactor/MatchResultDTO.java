package io.githib.sevenlyfoma.comp_tracker.Refactor;



import java.util.List;

import io.githib.sevenlyfoma.comp_tracker.Model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class MatchResultDTO {
    List<User> users;
    List<Integer> points;
    
}
