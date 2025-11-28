package com.example.gamescord.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        // API 정보 설정
        Info info = new Info()
                .title("gamescord API Documentation")
                .version("1.0.0")
                .description("API documentation for the gamescord project.");

        // JWT Bearer Token 인증을 위한 SecurityScheme 정의
        String jwtSchemeName = "bearerAuth";
        Components components = new Components()
                .addSecuritySchemes(jwtSchemeName, new SecurityScheme()
                        .name(jwtSchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"));

        // 전역 보안 요구사항을 제거하고, SecurityScheme 정의만 포함
        return new OpenAPI()
                .info(info)
                .components(components);
    }
}
