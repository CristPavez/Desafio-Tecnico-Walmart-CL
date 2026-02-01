package io.github.cristpavez.server_retail_walmart_cl.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("servicio", "Retail API - Walmart Chile");
        response.put("version", "1.0");
        response.put("endpoints", Map.of(
            "catalogo", "/api/products",
            "checkout", "/api/checkout",
            "despacho", "/api/delivery/windows?zipCode={codigo}",
            "ml-search", "/api/ml-search"
        ));
        return ResponseEntity.ok(response);
    }
}
