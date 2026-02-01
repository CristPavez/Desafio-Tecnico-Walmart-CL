package io.github.cristpavez.server_retail_walmart_cl.services;

import org.springframework.stereotype.Service;

@Service
public class PromotionService {
    
    public Double calculatePromoCodeDiscount(String promoCode, Double subtotal) {
        if (promoCode == null) return 0.0;
        
        return switch (promoCode.toUpperCase()) {
            case "SAVE10" -> subtotal * 0.10;
            case "SAVE20" -> subtotal * 0.20;
            case "WELCOME" -> 5.00;
            default -> 0.0;
        };
    }
}
