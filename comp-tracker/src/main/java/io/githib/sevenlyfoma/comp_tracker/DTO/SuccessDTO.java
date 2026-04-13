package io.githib.sevenlyfoma.comp_tracker.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuccessDTO {
    private LocalDateTime timestamp;
    private int status;
    private String message;

    public SuccessDTO(int status, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
    }

    

}
    

 