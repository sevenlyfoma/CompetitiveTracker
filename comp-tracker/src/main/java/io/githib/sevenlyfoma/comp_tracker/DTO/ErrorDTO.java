package io.githib.sevenlyfoma.comp_tracker.DTO;

import java.time.LocalDateTime;

public record  ErrorDTO (
    LocalDateTime timestamp,
    int status,
    String error,
    String message
) {}
 