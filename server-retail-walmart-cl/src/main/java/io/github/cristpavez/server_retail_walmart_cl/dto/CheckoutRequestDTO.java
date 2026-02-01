package io.github.cristpavez.server_retail_walmart_cl.dto;

import io.github.cristpavez.server_retail_walmart_cl.model.CartItem;
import io.github.cristpavez.server_retail_walmart_cl.model.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequestDTO {
    private List<CartItem> items;
    private PaymentMethod paymentMethod;
    private String promoCode;
}
