package io.githib.sevenlyfoma.comp_tracker.Model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "tournament_entrants")
// @IdClass(TournamentEntrantId.class)
@IdClass(TournamentEntrant.TournamentEntrantPk.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TournamentEntrant {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private Tournament tournament;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class TournamentEntrantPk implements Serializable {
        private Long user;
        private Long tournament;
    }

}