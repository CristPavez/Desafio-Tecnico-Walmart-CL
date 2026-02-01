package io.github.cristpavez.server_retail_walmart_cl.repositories;

import io.github.cristpavez.server_retail_walmart_cl.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
 

@Repository
public interface ZoneRepository extends JpaRepository<Zone, String> {
 
    List<Zone> findByActiveTrue();
}
