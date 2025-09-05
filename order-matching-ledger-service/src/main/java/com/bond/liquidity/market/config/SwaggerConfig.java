package com.bond.liquidity.market.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI configuration for the Bond Market API.
 * 
 * <p>This configuration class sets up Swagger UI and OpenAPI documentation
 * for the bond trading system. It provides comprehensive API documentation
 * with examples, schemas, and interactive testing capabilities.</p>
 * 
 * @author Bond Market Team
 * @version 1.0
 * @since 1.0
 */
@Configuration
public class SwaggerConfig {

    /**
     * Configures OpenAPI documentation for the Bond Market API.
     * 
     * @return OpenAPI configuration with API information and server details
     */
    @Bean
    public OpenAPI bondMarketOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development server");

        Contact contact = new Contact();
        contact.setEmail("dev@bondmarket.com");
        contact.setName("Bond Market Team");

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0");

        Info info = new Info()
                .title("Bond Market Order Matching API")
                .version("1.0.0")
                .contact(contact)
                .description("API for bond market order matching system with Redis-based ledger")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
