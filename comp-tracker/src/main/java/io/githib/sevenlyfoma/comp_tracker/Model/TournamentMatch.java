package io.githib.sevenlyfoma.comp_tracker.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tournament_matches")
@IdClass(TournamentMatchId.class)
public class TournamentMatch {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Id
    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
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

    public TournamentMatch() {
    }

    public TournamentMatch(Tournament tournament, User user1, User user2, TournamentMatch parentMatch1,
            TournamentMatch parentMatch2, Match matchRecord) {
        this.tournament = tournament;
        this.user1 = user1;
        this.user2 = user2;
        this.parentMatch1 = parentMatch1;
        this.parentMatch2 = parentMatch2;
        this.matchRecord = matchRecord;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

    public TournamentMatch getParentMatch1() {
        return parentMatch1;
    }

    public void setParentMatch1(TournamentMatch parentMatch1) {
        this.parentMatch1 = parentMatch1;
    }

    public TournamentMatch getParentMatch2() {
        return parentMatch2;
    }

    public void setParentMatch2(TournamentMatch parentMatch2) {
        this.parentMatch2 = parentMatch2;
    }

    public Match getMatchRecord() {
        return matchRecord;
    }

    public void setMatchRecord(Match matchRecord) {
        this.matchRecord = matchRecord;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((tournament == null) ? 0 : tournament.hashCode());
        result = prime * result + ((user1 == null) ? 0 : user1.hashCode());
        result = prime * result + ((user2 == null) ? 0 : user2.hashCode());
        result = prime * result + ((parentMatch1 == null) ? 0 : parentMatch1.hashCode());
        result = prime * result + ((parentMatch2 == null) ? 0 : parentMatch2.hashCode());
        result = prime * result + ((matchRecord == null) ? 0 : matchRecord.hashCode());
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
        TournamentMatch other = (TournamentMatch) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (tournament == null) {
            if (other.tournament != null)
                return false;
        } else if (!tournament.equals(other.tournament))
            return false;
        if (user1 == null) {
            if (other.user1 != null)
                return false;
        } else if (!user1.equals(other.user1))
            return false;
        if (user2 == null) {
            if (other.user2 != null)
                return false;
        } else if (!user2.equals(other.user2))
            return false;
        if (parentMatch1 == null) {
            if (other.parentMatch1 != null)
                return false;
        } else if (!parentMatch1.equals(other.parentMatch1))
            return false;
        if (parentMatch2 == null) {
            if (other.parentMatch2 != null)
                return false;
        } else if (!parentMatch2.equals(other.parentMatch2))
            return false;
        if (matchRecord == null) {
            if (other.matchRecord != null)
                return false;
        } else if (!matchRecord.equals(other.matchRecord))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "TournamentMatch [id=" + id + ", tournament=" + tournament + ", user1=" + user1 + ", user2=" + user2
                + ", parentMatch1=" + parentMatch1 + ", parentMatch2=" + parentMatch2 + ", matchRecord=" + matchRecord
                + "]";
    }

    
}
