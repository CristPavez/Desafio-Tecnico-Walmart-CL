package io.github.cristpavez.server_retail_walmart_cl.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zone {
    
    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String id;
    
    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String name;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String zipCode;
    
    @Column(nullable = false)
    private Boolean active = true;
}
