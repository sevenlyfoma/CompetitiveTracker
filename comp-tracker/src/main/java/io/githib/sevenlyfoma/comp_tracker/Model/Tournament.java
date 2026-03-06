package io.githib.sevenlyfoma.comp_tracker.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tournaments")
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use LocalDateTime to match SQL TIMESTAMP
    @Column(name = "tournament_name", nullable = false)
    private String tournamentName;

    @Column(name = "closed", nullable = false)
    private Boolean closed;

    public Tournament() {}

    public Tournament(String tournamentName, Boolean closed) {
        this.tournamentName = tournamentName;
        this.closed = closed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public void setTournamentName(String tournamentName) {
        this.tournamentName = tournamentName;
    }

    public Boolean getClosed() {
        return closed;
    }

    public void setClosed(Boolean closed) {
        this.closed = closed;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((tournamentName == null) ? 0 : tournamentName.hashCode());
        result = prime * result + ((closed == null) ? 0 : closed.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Tournament other = (Tournament) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (tournamentName == null) {
            if (other.tournamentName != null)
                return false;
        } else if (!tournamentName.equals(other.tournamentName))
            return false;
        if (closed == null) {
            if (other.closed != null)
                return false;
        } else if (!closed.equals(other.closed))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Tournament [id=" + id + ", tournamentName=" + tournamentName + ", closed=" + closed + "]";
    }

    
    
}
