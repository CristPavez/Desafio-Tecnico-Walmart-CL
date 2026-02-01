package io.github.cristpavez.server_retail_walmart_cl.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "delivery_windows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryWindow {
    
    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String id; 
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "capacity_total", nullable = false)
    private Integer capacityTotal;
    
    @Column(name = "capacity_by_zone", columnDefinition = "TEXT")
    private String capacityByZone; 
    
    @Column(nullable = false)
    private Double cost; 
    
    @Version
    private Long version;
    
    public Boolean isAvailable(String zoneId) {

        return capacityTotal > 0;
    }
}
