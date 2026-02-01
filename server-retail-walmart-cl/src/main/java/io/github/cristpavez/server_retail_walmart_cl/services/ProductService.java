package io.github.cristpavez.server_retail_walmart_cl.services;

import io.github.cristpavez.server_retail_walmart_cl.dto.ProductDTO;
import io.github.cristpavez.server_retail_walmart_cl.dto.ProductFilterDTO;
import io.github.cristpavez.server_retail_walmart_cl.model.Product;
import io.github.cristpavez.server_retail_walmart_cl.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public Page<ProductDTO> findProducts(ProductFilterDTO filter, int page, int size) {
        Sort sort = filter.getSortDirection().equalsIgnoreCase("desc") 
            ? Sort.by(filter.getSortBy()).descending() 
            : Sort.by(filter.getSortBy()).ascending();
        
        PageRequest pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products = productRepository.findByFilters(
            filter.getSearch(),
            filter.getMinPrice(),
            filter.getMaxPrice(),
            filter.getBrand(),
            filter.getCategory(),
            pageable
        );
        
        return products.map(this::toDTO);
    }
    
    public ProductDTO findById(String id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return toDTO(product);
    }
    
    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
            .map(Product::getCategory)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
    
    private ProductDTO toDTO(Product p) {
        return new ProductDTO(
            p.getId(), 
            p.getName(), 
            p.getDescription(), 
            p.getPrice(), 
            p.getOldPrice(),
            p.getStock(),
            p.getTagsArray(),
            p.getBrand(), 
            p.getCategory(), 
            p.getImageUrl()
        );
    }
}
