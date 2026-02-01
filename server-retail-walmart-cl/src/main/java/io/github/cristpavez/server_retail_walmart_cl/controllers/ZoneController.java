package io.github.cristpavez.server_retail_walmart_cl.controllers;

import io.github.cristpavez.server_retail_walmart_cl.model.Zone;
import io.github.cristpavez.server_retail_walmart_cl.repositories.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
public class ZoneController {
    
    private final ZoneRepository zoneRepository;
    
    @GetMapping
    // Todas las zonas activas
    public ResponseEntity<List<Zone>> getAllZones() {
        List<Zone> zones = zoneRepository.findByActiveTrue();
        return ResponseEntity.ok(zones);
    }
    
    @GetMapping("/{id}")
     // Todas las zonas activas por ID
    public ResponseEntity<Zone> getZoneById(@PathVariable String id) {
        return zoneRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
