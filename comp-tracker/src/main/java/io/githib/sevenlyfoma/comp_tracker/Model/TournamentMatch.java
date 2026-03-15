package io.githib.sevenlyfoma.comp_tracker.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TournamentMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "match_number")
    private Long matchNumber;

    @Column(name = "inherits_parent_match_1_winner")
    private Boolean inheritsParentMatch1Winner;

    @Column(name = "inherits_parent_match_2_winner")
    private Boolean inheritsParentMatch2Winner;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    // @ManyToOne
    // @JoinColumn(name = "parent_match_1_id")
    // private TournamentMatch parentMatch1;

    // @ManyToOne
    // @JoinColumn(name = "parent_match_2_id")
    // private TournamentMatch parentMatch2;

    
    @Column(name = "parent_match_1_id")
    private Long parentMatch1Id;

    @Column(name = "parent_match_2_id")
    private Long parentMatch2Id;

    @ManyToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    @OneToOne
    @JoinColumn(name = "match_record_id")
    private Match matchRecord;
}
