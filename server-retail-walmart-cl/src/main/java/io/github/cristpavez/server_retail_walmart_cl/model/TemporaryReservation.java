package io.github.cristpavez.server_retail_walmart_cl.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "temporary_reservations")
@Data
public class TemporaryReservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "delivery_window_id", nullable = false, columnDefinition = "TEXT")
    private String deliveryWindowId;
    
    @Column(name = "session_id", nullable = false, columnDefinition = "TEXT")
    private String sessionId;
    
    @Column(name = "zone_id", nullable = false, columnDefinition = "TEXT")
    private String zoneId; 
    
    @Column(name = "reserved_at", nullable = false)
    private LocalDateTime reservedAt;
}
