package io.github.cristpavez.server_retail_walmart_cl.services;

import io.github.cristpavez.server_retail_walmart_cl.dto.CheckoutRequestDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.CheckoutResponseDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.CheckoutResponseDTO.DiscountDetail;
import io.github.cristpavez.server_retail_walmart_cl.model.CartItem;
import io.github.cristpavez.server_retail_walmart_cl.model.Product;
import io.github.cristpavez.server_retail_walmart_cl.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckoutService {
    
    private final PromotionService promotionService;
    private final ProductRepository productRepository;
    
    public CheckoutResponseDTO processCheckout(CheckoutRequestDTO request) {
        List<CartItem> items = request.getItems();
        List<DiscountDetail> discounts = new ArrayList<>();
        
      
        List<String> skus = items.stream()
            .map(CartItem::getSku)
            .collect(Collectors.toList());
        List<Product> products = productRepository.findAllById(skus);
        Map<String, Product> productMap = products.stream()
            .collect(Collectors.toMap(Product::getId, p -> p));
        
    
        double subtotal = items.stream()
            .mapToDouble(item -> {
                Product product = productMap.get(item.getSku());
                if (product != null) {
                    return product.getPrice() * item.getQuantity();
                }
                return 0.0;
            })
            .sum();
        

        double productDiscounts = 0.0;
        

        double promoDiscount = promotionService.calculatePromoCodeDiscount(
            request.getPromoCode(), subtotal);
        if (promoDiscount > 0) {
            discounts.add(new DiscountDetail("Promoción", 
                request.getPromoCode(), promoDiscount));
        }
        
  
        double paymentDiscount = 0.0;
        if (request.getPaymentMethod() != null) {
            paymentDiscount = subtotal * request.getPaymentMethod().getDiscountPercentage();
            if (paymentDiscount > 0) {
                discounts.add(new DiscountDetail("Medio de Pago", 
                    request.getPaymentMethod().name(), paymentDiscount));
            }
        }
        
        double totalDiscounts = productDiscounts + promoDiscount + paymentDiscount;
        double total = subtotal - totalDiscounts;
        
        return new CheckoutResponseDTO(subtotal, discounts, totalDiscounts, total);
    }
}
