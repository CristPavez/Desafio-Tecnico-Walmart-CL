package io.github.cristpavez.server_retail_walmart_cl.controllers;

import io.github.cristpavez.server_retail_walmart_cl.dto.CheckoutRequestDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.CheckoutResponseDTO;
import io.github.cristpavez.server_retail_walmart_cl.services.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {
    
    private final CheckoutService checkoutService;
    
    @PostMapping
    // Procesar el checkout
    public ResponseEntity<CheckoutResponseDTO> processCheckout(@RequestBody CheckoutRequestDTO request) {
        CheckoutResponseDTO response = checkoutService.processCheckout(request);
        return ResponseEntity.ok(response);
    }
}

