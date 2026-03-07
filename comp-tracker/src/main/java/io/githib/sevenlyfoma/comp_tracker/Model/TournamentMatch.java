package io.githib.sevenlyfoma.comp_tracker.Model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;




@Entity
@Table(name = "tournament_matches")
// @IdClass(TournamentMatchId.class)
@IdClass(TournamentMatch.TournamentMatchPk.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TournamentMatch {

    @Id
    @Column(name = "id", nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private Long id;

    @Id
    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    @ToString.Include
    @EqualsAndHashCode.Include
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "parent_match_1_id", referencedColumnName = "id"),
        @JoinColumn(name = "parent_match_1_tournament_id", referencedColumnName = "tournament_id")
    })
    private TournamentMatch parentMatch1;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "parent_match_2_id", referencedColumnName = "id"),
        @JoinColumn(name = "parent_match_2_tournament_id", referencedColumnName = "tournament_id")
    })
    private TournamentMatch parentMatch2;

    @OneToOne
    @JoinColumn(name = "match_record_id")
    private Match matchRecord;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class TournamentMatchPk implements Serializable {
        private Long id;
        private Long tournament;
    }
}
