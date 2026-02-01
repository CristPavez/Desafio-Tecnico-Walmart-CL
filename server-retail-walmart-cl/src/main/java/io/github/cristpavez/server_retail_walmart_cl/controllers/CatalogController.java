package io.github.cristpavez.server_retail_walmart_cl.controllers;

import io.github.cristpavez.server_retail_walmart_cl.dto.ProductDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.ProductFilterDTO;
import io.github.cristpavez.server_retail_walmart_cl.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class CatalogController {
    
    private final ProductService productService;
    
    @GetMapping
    // Obtener productos con filtros y paginación
    public ResponseEntity<Map<String, Object>> getProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        ProductFilterDTO filter = new ProductFilterDTO();
        filter.setSearch(isEmpty(search) ? null : search);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setBrand(isEmpty(brand) ? null : brand);
        filter.setCategory(isEmpty(category) ? null : category);
        filter.setSortBy(sortBy);
        filter.setSortDirection(sortDirection);
        
        Page<ProductDTO> products = productService.findProducts(filter, page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("totalPages", products.getTotalPages());
        response.put("totalElements", products.getTotalElements());
        response.put("currentPage", products.getNumber());
        response.put("pageSize", products.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    // Obtener detalles de un producto por ID
    public ResponseEntity<ProductDTO> getProduct(@PathVariable String id) {
        ProductDTO product = productService.findById(id);
        return ResponseEntity.ok(product);
    }
    
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}

