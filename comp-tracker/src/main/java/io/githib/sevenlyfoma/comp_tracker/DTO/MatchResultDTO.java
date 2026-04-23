package io.githib.sevenlyfoma.comp_tracker.DTO;



import java.util.List;

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
    List<Long> userIds;
    List<Integer> points;
    
}
