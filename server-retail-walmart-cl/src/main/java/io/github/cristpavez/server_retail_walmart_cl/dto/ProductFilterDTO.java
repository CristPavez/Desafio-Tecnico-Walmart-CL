package io.github.cristpavez.server_retail_walmart_cl.dto;

import lombok.Data;

@Data
public class ProductFilterDTO {
    private String search;
    private Double minPrice;
    private Double maxPrice;
    private String brand;
    private String category;
    private String sortBy = "id";
    private String sortDirection = "asc";
}
