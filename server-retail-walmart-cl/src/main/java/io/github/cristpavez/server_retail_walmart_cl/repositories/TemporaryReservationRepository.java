package io.github.cristpavez.server_retail_walmart_cl.repositories;

import io.github.cristpavez.server_retail_walmart_cl.model.TemporaryReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface TemporaryReservationRepository extends JpaRepository<TemporaryReservation, Long> {
    
    Optional<TemporaryReservation> findBySessionIdAndDeliveryWindowId(String sessionId, String deliveryWindowId);
    
    List<TemporaryReservation> findBySessionId(String sessionId);
    
    @Modifying
    @Query("DELETE FROM TemporaryReservation tr WHERE tr.sessionId = :sessionId")
    void deleteBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT COUNT(tr) FROM TemporaryReservation tr WHERE tr.deliveryWindowId = :windowId")
    long countActiveReservationsByWindow(@Param("windowId") String windowId);
    
    @Query("SELECT COUNT(tr) FROM TemporaryReservation tr WHERE tr.deliveryWindowId = :windowId AND tr.zoneId = :zoneId")
    long countActiveReservationsByWindowAndZone(@Param("windowId") String windowId, @Param("zoneId") String zoneId);
}
