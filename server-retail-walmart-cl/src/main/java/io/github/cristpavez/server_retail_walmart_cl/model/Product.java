package io.github.cristpavez.server_retail_walmart_cl.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String id; 
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;
    
    @Column(length = 1000, columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String brand;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "old_price")
    private Double oldPrice;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(columnDefinition = "TEXT")
    private String tags; 
    
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    public String[] getTagsArray() {
        if (tags == null || tags.isEmpty()) return new String[0];
        return tags.split(",");
    }
}
