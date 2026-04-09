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
public class TournamentDTO {
    @ToString.Include
    private String name;
    @ToString.Include
    private String style;
}
