package io.githib.sevenlyfoma.comp_tracker.Model;

import java.io.Serializable;
import java.util.Objects;

public class TournamentEntrantId implements Serializable {

    private Long user;       // Matches field name 'user' in the Entity
    private Long tournament; // Matches field name 'tournament' in the Entity

    public TournamentEntrantId() {}

    public TournamentEntrantId(Long user, Long tournament) {
        this.user = user;
        this.tournament = tournament;
    }

    // Getters and Setters
    public Long getUser() { return user; }
    public void setUser(Long user) { this.user = user; }

    public Long getTournament() { return tournament; }
    public void setTournament(Long tournament) { this.tournament = tournament; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TournamentEntrantId that = (TournamentEntrantId) o;
        return Objects.equals(user, that.user) && 
               Objects.equals(tournament, that.tournament);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, tournament);
    }
}
