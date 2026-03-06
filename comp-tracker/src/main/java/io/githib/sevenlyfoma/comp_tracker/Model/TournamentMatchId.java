package io.githib.sevenlyfoma.comp_tracker.Model;

import java.io.Serializable;
import java.util.Objects;

public class TournamentMatchId implements Serializable {

    private Long id;
    private Long tournament; // Matches the field name in TournamentMatch entity

    // 1. Default constructor
    public TournamentMatchId() {
    }

    // 2. All-args constructor (convenient for manual instantiation)
    public TournamentMatchId(Long id, Long tournament) {
        this.id = id;
        this.tournament = tournament;
    }

    // 3. Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTournament() {
        return tournament;
    }

    public void setTournament(Long tournament) {
        this.tournament = tournament;
    }

    // 4. equals() method
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TournamentMatchId that = (TournamentMatchId) o;
        return Objects.equals(id, that.id) && 
               Objects.equals(tournament, that.tournament);
    }

    // 5. hashCode() method
    @Override
    public int hashCode() {
        return Objects.hash(id, tournament);
    }
}