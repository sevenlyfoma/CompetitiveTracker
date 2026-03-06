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

    public Tournament() {}
    
}
