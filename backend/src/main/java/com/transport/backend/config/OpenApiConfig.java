package com.transport.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TransitGo Bus Booking System REST APIs")
                        .version("1.0.0")
                        .description("Full enterprise RESTful API documentation for TransitGo Transport Platform.")
                        .contact(new Contact()
                                .name("TransitGo Engineering")
                                .email("support@transitgo.lk")));
    }
}