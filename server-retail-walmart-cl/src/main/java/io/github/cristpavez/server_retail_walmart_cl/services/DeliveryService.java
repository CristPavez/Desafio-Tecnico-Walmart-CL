package io.github.cristpavez.server_retail_walmart_cl.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cristpavez.server_retail_walmart_cl.dto.DeliverySearchDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.DeliveryWindowDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.SoftReservationRequestDTO;
import io.github.cristpavez.server_retail_walmart_cl.model.DeliveryWindow;
import io.github.cristpavez.server_retail_walmart_cl.model.TemporaryReservation;
import io.github.cristpavez.server_retail_walmart_cl.repositories.DeliveryWindowRepository;
import io.github.cristpavez.server_retail_walmart_cl.repositories.TemporaryReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryWindowRepository deliveryWindowRepository;
    private final TemporaryReservationRepository temporaryReservationRepository;

    @Transactional
    public List<DeliveryWindowDTO> searchAvailableWindows(DeliverySearchDTO search) {

        // El frontend es completamente responsable de manejar la expiración
        // El backend solo almacena y retorna los datos
        
        LocalDate searchDate = LocalDate.parse(search.getDate());
        List<DeliveryWindow> windows = deliveryWindowRepository
                .findByDate(searchDate);
  
        
      
        return windows.stream()
                .map(w -> toDTO(w, search.getZoneId(), search.getSessionId()))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TemporaryReservation createSoftReservation(SoftReservationRequestDTO request) {
   
        DeliveryWindow window = deliveryWindowRepository
                .findById(request.getDeliveryWindowId())
                .orElseThrow(() -> new RuntimeException("Ventana no encontrada"));
        
  
        Map<String, Integer> capacityByZone = new HashMap<>();
        try {
            if (window.getCapacityByZone() != null && !window.getCapacityByZone().trim().isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                capacityByZone = mapper.readValue(window.getCapacityByZone(), 
                    new TypeReference<Map<String, Integer>>() {});
            }
        } catch (Exception e) {
            log.error("Error parsing capacityByZone: {}", e.getMessage());
            throw new RuntimeException("Error al procesar capacidad por zona");
        }
        

        Integer zoneCapacity = capacityByZone.get(request.getZoneId());
        if (zoneCapacity == null || zoneCapacity <= 0) {
            throw new RuntimeException("No hay capacidad disponible para tu zona en esta ventana");
        }
        
  
        long activeReservationsInZone = temporaryReservationRepository
                .countActiveReservationsByWindowAndZone(
                    window.getId(), 
                    request.getZoneId()
                );
        

        
   
        if (activeReservationsInZone >= zoneCapacity) {
            throw new RuntimeException(
                String.format("La Ventana ha alcanzado el límite de capacidad (%d/%d). Por favor selecciona otro horario.",
                    activeReservationsInZone, zoneCapacity)
            );
        }
        

        long activeReservationsTotal = temporaryReservationRepository
                .countActiveReservationsByWindow(window.getId());
        
        if (activeReservationsTotal >= window.getCapacityTotal()) {
            throw new RuntimeException("Ventana sin disponibilidad total");
        }
        
      
        Optional<TemporaryReservation> existingForWindow = 
                temporaryReservationRepository.findBySessionIdAndDeliveryWindowId(
                    request.getSessionId(), request.getDeliveryWindowId());
        
      
        if (existingForWindow.isPresent()) {
            TemporaryReservation existing = existingForWindow.get();
            existing.setReservedAt(LocalDateTime.now());
            existing.setZoneId(request.getZoneId()); 
            return temporaryReservationRepository.save(existing);
        }
        
  
        temporaryReservationRepository.deleteBySessionId(request.getSessionId());
        temporaryReservationRepository.flush(); 
        
  
        TemporaryReservation reservation = new TemporaryReservation();
        reservation.setDeliveryWindowId(request.getDeliveryWindowId());
        reservation.setSessionId(request.getSessionId());
        reservation.setZoneId(request.getZoneId());
        reservation.setReservedAt(LocalDateTime.now());
  
        return temporaryReservationRepository.save(reservation);
    }

    private DeliveryWindowDTO toDTO(DeliveryWindow w, String zoneId, String sessionId) {

        Map<String, Integer> capacityByZone = new HashMap<>();
        try {
            if (w.getCapacityByZone() != null && !w.getCapacityByZone().trim().isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                capacityByZone = mapper.readValue(w.getCapacityByZone(), 
                    new TypeReference<Map<String, Integer>>() {});
            }
        } catch (Exception e) {
            log.warn("Error parsing capacityByZone JSON: {}", e.getMessage());
        }
        

        Map<String, Integer> realCapacityByZone = new HashMap<>();
        
        for (Map.Entry<String, Integer> entry : capacityByZone.entrySet()) {
            String zone = entry.getKey();
            Integer configuredCapacity = entry.getValue();
            
       
            long activeReservations = temporaryReservationRepository
                    .countActiveReservationsByWindowAndZone(w.getId(), zone);
            
      
            int availableCapacity = (int) (configuredCapacity - activeReservations);
            realCapacityByZone.put(zone, Math.max(0, availableCapacity));
        }
        
        // Verificar si el usuario actual tiene una reserva en esta ventana para esta zona
        boolean isReservedByUser = false;
        
        if (zoneId != null) {
            Optional<TemporaryReservation> userReservation = temporaryReservationRepository
                    .findBySessionIdAndDeliveryWindowId(sessionId, w.getId());
            
            if (userReservation.isPresent()) {
                TemporaryReservation reservation = userReservation.get();
                
                // Solo marcar como reservado si la reserva es para la zona que está viendo
                if (reservation.getZoneId().equals(zoneId)) {
                    isReservedByUser = true;
                    
                    // Si el usuario tiene reserva para esta zona, asegurar que tenga al menos 1 cupo
                    Integer currentCapacity = realCapacityByZone.get(zoneId);
                    if (currentCapacity == null || currentCapacity < 1) {
                        realCapacityByZone.put(zoneId, 1);
                    }
                }
            }
        }
        
        return new DeliveryWindowDTO(
            w.getId(),
            w.getDate(), 
            w.getStartTime(), 
            w.getEndTime(), 
            w.getCapacityTotal(),
            realCapacityByZone,  
            w.getCost(),
            isReservedByUser
        );
    }
    
    @Transactional
    public void cancelReservation(String sessionId) {
        temporaryReservationRepository.deleteBySessionId(sessionId);
    }
}