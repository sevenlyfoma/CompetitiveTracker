package io.githib.sevenlyfoma.comp_tracker.DTO;

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
public class MatchCreationObject {
    @ToString.Include
    private Long winnerID;
    @ToString.Include
    private Long loserID;
}
