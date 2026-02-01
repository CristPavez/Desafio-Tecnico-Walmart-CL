package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String id;  
    private String name;
    private String description;
    private Double price;
    private Double oldPrice;
    private Integer stock;
    private String[] tags;
    private String brand;
    private String category;
    private String imageUrl;
}
