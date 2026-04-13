package io.githib.sevenlyfoma.comp_tracker.Exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import io.githib.sevenlyfoma.comp_tracker.DTO.ErrorDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    private ResponseEntity<ErrorDTO> buildErrorResponse(HttpStatus status, String errorCode, String message) {
        ErrorDTO error = new ErrorDTO(LocalDateTime.now(), status.value(), errorCode, message);
        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleGlobalException(Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "An unexpected error occurred.");
    }

    @ExceptionHandler(TournamentAlreadyClosedException.class)
    public ResponseEntity<ErrorDTO> handleTournamentAlreadyClosed(TournamentAlreadyClosedException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNPROCESSABLE_CONTENT, "UNPROCESSABLE_CONTENT", ex.getMessage());
    }

    @ExceptionHandler(MatchParticipantNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleMatchParticipantNotFound(MatchParticipantNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(MatchAgainstSelfException.class)
    public ResponseEntity<ErrorDTO> handleMatchAgainstSelf(MatchAgainstSelfException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNPROCESSABLE_CONTENT, "UNPROCESSABLE_CONTENT", ex.getMessage());
    }

    @ExceptionHandler(TournamentEntrantChangeAfterCloseException.class)
    public ResponseEntity<ErrorDTO> handleTournamentEntrantChangeAfterClose(TournamentEntrantChangeAfterCloseException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNPROCESSABLE_CONTENT, "UNPROCESSABLE_CONTENT", ex.getMessage());
    }

    @ExceptionHandler(DuplicateTournamentEntrantException.class)
    public ResponseEntity<ErrorDTO> handleDuplicateTournamentEntrant(DuplicateTournamentEntrantException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNPROCESSABLE_CONTENT, "UNPROCESSABLE_CONTENT", ex.getMessage());
    }

    @ExceptionHandler(MissingTournamentEntrantException.class)
    public ResponseEntity<ErrorDTO> handleMissingTournamentEntrant(MissingTournamentEntrantException ex, WebRequest request){
        return buildErrorResponse(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }


}