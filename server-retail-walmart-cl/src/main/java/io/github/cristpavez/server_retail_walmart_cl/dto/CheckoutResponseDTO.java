package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponseDTO {
    private Double subtotal;
    private List<DiscountDetail> discounts;
    private Double totalDiscounts;
    private Double total;
    
    @Data
    @AllArgsConstructor
    public static class DiscountDetail {
        private String type;
        private String description;
        private Double amount;
    }
}
