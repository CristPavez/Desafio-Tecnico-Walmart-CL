package io.github.cristpavez.server_retail_walmart_cl.config;

import io.github.cristpavez.server_retail_walmart_cl.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements ApplicationRunner {

    private final DataSource dataSource;
    private final ProductRepository productRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Check if database already has data
        long productCount = productRepository.count();
        
        if (productCount == 0) {
         
            
            try (Connection connection = dataSource.getConnection()) {
                // Execute data.sql only if database is empty
                ScriptUtils.executeSqlScript(connection, new ClassPathResource("data.sql"));
              
            } catch (Exception e) {
                log.error("Failed to load initial data", e);
                throw e;
            }
        }
    }
}
