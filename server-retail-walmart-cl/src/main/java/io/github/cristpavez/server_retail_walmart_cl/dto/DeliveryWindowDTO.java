package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryWindowDTO {
    private String id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacityTotal;
    private Map<String, Integer> capacityByZone;
    private Double cost;
    private Boolean isReservedByUser;
}
