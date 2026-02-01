package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.Data;

@Data
public class ReservationRequestDTO {
    private String deliveryWindowId;
    private String address;
}
