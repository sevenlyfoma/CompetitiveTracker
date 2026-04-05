package io.githib.sevenlyfoma.comp_tracker.DTO;

public class TournamentMatchResult {
    private Long tournamentMatchID;
    private Long winnerID;
    private Long loserID;

    
    public TournamentMatchResult(Long tournamentMatchID, Long winnerID, Long loserID) {
        this.tournamentMatchID = tournamentMatchID;
        this.winnerID = winnerID;
        this.loserID = loserID;
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
    public Long getLoserID() {
        return loserID;
    }
    public void setLoserID(Long loserID) {
        this.loserID = loserID;
    }

    

    
}
