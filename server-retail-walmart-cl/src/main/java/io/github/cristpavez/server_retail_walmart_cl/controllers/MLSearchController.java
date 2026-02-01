package io.github.cristpavez.server_retail_walmart_cl.controllers;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MLSearchController {
    
    private static final String ML_API_URL = "http://localhost:5000";
    private final RestTemplate restTemplate;

    @Data
    public static class MLSearchRequest {
        private String query;
        private Integer k = 5;
    }

    @Data
    public static class MLProductResult {
        private String id;
        private String name;
        private String brand;
        private String description;
        private double price;
        private String category;
        private String image_url;
        private double similarity_score;
    }

    // productos similares usando ML API
    @PostMapping("/ml-search")
    public ResponseEntity<?> searchProducts(@RequestBody MLSearchRequest request) {
        try {

            if (request.getK() == null || request.getQuery() == null || request.getQuery().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "error", "ML API no disponible",
                    "message", "Parámetros inválidos: query y k son requeridos"     ,
                    "hint", "Verifica que MLBackend esté corriendo"
                ));
            }
            
     
            Map<String, Object> mlRequest = new HashMap<>();
            mlRequest.put("query", request.getQuery());
            mlRequest.put("top_k", request.getK());

            String url = ML_API_URL + "/search";
            
            ResponseEntity<List<MLProductResult>> response = restTemplate.exchange(
                url, 
                HttpMethod.POST,
                new HttpEntity<>(mlRequest),
                new ParameterizedTypeReference<List<MLProductResult>>() {}
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
        
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "error", "ML API no disponible",
                    "message", e.getMessage(),
                    "hint", "Verifica que MLBackend esté corriendo"
                ));
        }
    }
}
