package io.github.cristpavez.server_retail_walmart_cl.model;

public enum PaymentMethod {
    CREDIT_CARD(0.0),
    DEBIT_CARD(0.10),
    CASH(0.05);
    
    private final Double discountPercentage;
    
    PaymentMethod(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public Double getDiscountPercentage() {
        return discountPercentage;
    }
}
