package io.github.cristpavez.server_retail_walmart_cl.repositories;

import io.github.cristpavez.server_retail_walmart_cl.model.DeliveryWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
 

@Repository
public interface DeliveryWindowRepository extends JpaRepository<DeliveryWindow, String> {
    
 
    @Query("SELECT dw FROM DeliveryWindow dw WHERE dw.date = :date ORDER BY dw.startTime")
    List<DeliveryWindow> findByDate(@Param("date") LocalDate date);
    
}
