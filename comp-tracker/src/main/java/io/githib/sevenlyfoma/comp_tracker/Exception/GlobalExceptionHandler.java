package io.githib.sevenlyfoma.comp_tracker.Exception;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import io.githib.sevenlyfoma.comp_tracker.DTO.ErrorDTO;
import io.githib.sevenlyfoma.comp_tracker.Service.TournamentService;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDTO error = new ErrorDTO(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TournamentAlreadyClosedException.class)
    public ResponseEntity<ErrorDTO> handleTournamentAlreadyClosed(TournamentAlreadyClosedException ex, WebRequest request) {
        logger.error("In handleTournamentAlreadyClosed");
        ErrorDTO error = new ErrorDTO(
            LocalDateTime.now(),
            HttpStatus.UNPROCESSABLE_CONTENT.value(),
            "UNPROCESSABLE_CONTENT",
            ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_CONTENT);
    }
}