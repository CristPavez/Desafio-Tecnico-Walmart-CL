package io.github.cristpavez.server_retail_walmart_cl.repositories;

import io.github.cristpavez.server_retail_walmart_cl.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    @Query(value = "SELECT * FROM products p WHERE " +
           "(:search IS NULL OR LOWER(CAST(p.name AS TEXT)) LIKE LOWER(CONCAT('%', CAST(:search AS TEXT), '%')) OR LOWER(CAST(p.description AS TEXT)) LIKE LOWER(CONCAT('%', CAST(:search AS TEXT), '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:brand IS NULL OR CAST(p.brand AS TEXT) = CAST(:brand AS TEXT)) AND " +
           "(:category IS NULL OR CAST(p.category AS TEXT) = CAST(:category AS TEXT))",
           nativeQuery = true)
    Page<Product> findByFilters(
        @Param("search") String search,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("brand") String brand,
        @Param("category") String category,
        Pageable pageable
    );
}
