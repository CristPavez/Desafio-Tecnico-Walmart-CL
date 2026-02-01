package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.Data;

@Data
public class SoftReservationRequestDTO {
    private String deliveryWindowId;
    private String sessionId;
    private String zoneId; 
}
