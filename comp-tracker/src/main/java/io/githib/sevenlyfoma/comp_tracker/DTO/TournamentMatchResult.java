package io.githib.sevenlyfoma.comp_tracker.DTO;

public class TournamentMatchResult {
    private Long tournamentMatchID;
    private Long winnerID;

    public TournamentMatchResult(Long tournamentMatchID, Long winnerID) {
        this.tournamentMatchID = tournamentMatchID;
        this.winnerID = winnerID;
    }
    public Long getTournamentMatchID() {
        return tournamentMatchID;
    }
    public void setTournamentMatchID(Long tournamentMatchID) {
        this.tournamentMatchID = tournamentMatchID;
    }
    public Long getWinnerID() {
        return winnerID;
    }
    public void setWinnerID(Long winnerID) {
        this.winnerID = winnerID;
    }

    
}
