package io.github.cristpavez.server_retail_walmart_cl.controllers;

import io.github.cristpavez.server_retail_walmart_cl.dto.DeliverySearchDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.DeliveryWindowDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.SoftReservationRequestDTO;
import io.github.cristpavez.server_retail_walmart_cl.model.TemporaryReservation;
import io.github.cristpavez.server_retail_walmart_cl.services.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {
    
    private final DeliveryService deliveryService;
    
    @PostMapping("/search")
    // Buscar ventanas de despacho disponibles
    public ResponseEntity<List<DeliveryWindowDTO>> searchWindows(@RequestBody DeliverySearchDTO search) {
        List<DeliveryWindowDTO> windows = deliveryService.searchAvailableWindows(search);
        return ResponseEntity.ok(windows);
    }
    
    @PostMapping("/soft-reserve")
    // Crear una reserva temporal para una ventana de despacho
    public ResponseEntity<TemporaryReservation> createSoftReservation(@RequestBody SoftReservationRequestDTO request) {
        TemporaryReservation reservation = deliveryService.createSoftReservation(request);
        return ResponseEntity.ok(reservation);
    }
    
    @DeleteMapping("/cancel-reservation/{sessionId}")
    // Cancelar reserva temporal del usuario
    public ResponseEntity<Void> cancelReservation(@PathVariable String sessionId) {
        deliveryService.cancelReservation(sessionId);
        return ResponseEntity.ok().build();
    }
    
}
