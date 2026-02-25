package io.githib.sevenlyfoma.comp_tracker;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use LocalDateTime to match SQL TIMESTAMP
    @Column(name = "date_of_match", nullable = false)
    private java.time.LocalDateTime dateOfMatch;

    // This maps the 'user1_id' column to a User object
    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @ManyToOne
    @JoinColumn(name = "winner_id", nullable = false)
    private User winner;

    @Column(name = "user1_rating_before", nullable = false)
    private Integer user1RatingBefore; 

    @Column(name = "user1_rating_after", nullable = false)
    private Integer user1RatingAfter;

    @Column(name = "user2_rating_before", nullable = false)
    private Integer user2RatingBefore;

    @Column(name = "user2_rating_after", nullable = false)
    private Integer user2RatingAfter;

    public Match(){

    }

    public Match(LocalDateTime dateOfMatch, User user1, User user2, User winner, Integer user1RatingBefore,
            Integer user1RatingAfter, Integer user2RatingBefore, Integer user2RatingAfter) {
        this.dateOfMatch = dateOfMatch;
        this.user1 = user1;
        this.user2 = user2;
        this.winner = winner;
        this.user1RatingBefore = user1RatingBefore;
        this.user1RatingAfter = user1RatingAfter;
        this.user2RatingBefore = user2RatingBefore;
        this.user2RatingAfter = user2RatingAfter;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public java.time.LocalDateTime getDateOfMatch() {
        return dateOfMatch;
    }

    public void setDateOfMatch(java.time.LocalDateTime dateOfMatch) {
        this.dateOfMatch = dateOfMatch;
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

    public User getWinner() {
        return winner;
    }

    public void setWinner(User winner) {
        this.winner = winner;
    }

    public Integer getUser1RatingBefore() {
        return user1RatingBefore;
    }

    public void setUser1RatingBefore(Integer user1RatingBefore) {
        this.user1RatingBefore = user1RatingBefore;
    }

    public Integer getUser1RatingAfter() {
        return user1RatingAfter;
    }

    public void setUser1RatingAfter(Integer user1RatingAfter) {
        this.user1RatingAfter = user1RatingAfter;
    }

    public Integer getUser2RatingBefore() {
        return user2RatingBefore;
    }

    public void setUser2RatingBefore(Integer user2RatingBefore) {
        this.user2RatingBefore = user2RatingBefore;
    }

    public Integer getUser2RatingAfter() {
        return user2RatingAfter;
    }

    public void setUser2RatingAfter(Integer user2RatingAfter) {
        this.user2RatingAfter = user2RatingAfter;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((dateOfMatch == null) ? 0 : dateOfMatch.hashCode());
        result = prime * result + ((user1 == null) ? 0 : user1.hashCode());
        result = prime * result + ((user2 == null) ? 0 : user2.hashCode());
        result = prime * result + ((winner == null) ? 0 : winner.hashCode());
        result = prime * result + ((user1RatingBefore == null) ? 0 : user1RatingBefore.hashCode());
        result = prime * result + ((user1RatingAfter == null) ? 0 : user1RatingAfter.hashCode());
        result = prime * result + ((user2RatingBefore == null) ? 0 : user2RatingBefore.hashCode());
        result = prime * result + ((user2RatingAfter == null) ? 0 : user2RatingAfter.hashCode());
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
        Match other = (Match) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (dateOfMatch == null) {
            if (other.dateOfMatch != null)
                return false;
        } else if (!dateOfMatch.equals(other.dateOfMatch))
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
        if (winner == null) {
            if (other.winner != null)
                return false;
        } else if (!winner.equals(other.winner))
            return false;
        if (user1RatingBefore == null) {
            if (other.user1RatingBefore != null)
                return false;
        } else if (!user1RatingBefore.equals(other.user1RatingBefore))
            return false;
        if (user1RatingAfter == null) {
            if (other.user1RatingAfter != null)
                return false;
        } else if (!user1RatingAfter.equals(other.user1RatingAfter))
            return false;
        if (user2RatingBefore == null) {
            if (other.user2RatingBefore != null)
                return false;
        } else if (!user2RatingBefore.equals(other.user2RatingBefore))
            return false;
        if (user2RatingAfter == null) {
            if (other.user2RatingAfter != null)
                return false;
        } else if (!user2RatingAfter.equals(other.user2RatingAfter))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Match [id=" + id + ", dateOfMatch=" + dateOfMatch + ", user1=" + user1 + ", user2=" + user2
                + ", winner=" + winner + ", user1RatingBefore=" + user1RatingBefore + ", user1RatingAfter="
                + user1RatingAfter + ", user2RatingBefore=" + user2RatingBefore + ", user2RatingAfter="
                + user2RatingAfter + "]";
    }

    

    
    
}
