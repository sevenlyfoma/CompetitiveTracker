package io.githib.sevenlyfoma.comp_tracker.Exception;

public class TournamentAlreadyClosedException extends RuntimeException{
    public TournamentAlreadyClosedException(String message) {
        super(message);
    }
}
