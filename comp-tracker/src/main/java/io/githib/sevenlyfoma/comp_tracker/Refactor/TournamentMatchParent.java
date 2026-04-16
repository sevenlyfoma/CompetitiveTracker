package io.githib.sevenlyfoma.comp_tracker.Refactor;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.githib.sevenlyfoma.comp_tracker.Model.TournamentMatch;
import io.githib.sevenlyfoma.comp_tracker.Model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tournament_match_parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentMatchParent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_match_id", nullable = false)
    @JsonIgnore
    private TournamentMatch tournamentMatch;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "parent_match_id", nullable = false)
    private TournamentMatch parentMatch;

    @Column(name = "inherits_parent_match_winner")
    private Boolean inheritsParentMatchWinner;

    @Override
    public String toString() {
        return "TournamentMatchParent [user=" + user + ", parentMatch=" + parentMatch + ", inheritsParentMatchWinner="
                + inheritsParentMatchWinner + "]";
    }

    
}

