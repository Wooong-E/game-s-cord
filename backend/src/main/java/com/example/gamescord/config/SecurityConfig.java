package com.example.gamescord.config;

import com.example.gamescord.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Spring Security의 필터 체인을 정의
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // csrf 비활성화
                .httpBasic(httpBasic -> httpBasic.disable()) // httpBasic 인증 방식 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션을 사용하지 않도록 변경
                .formLogin(form -> form.disable()) // Spring 기본 로그인 폼 비활성화
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.GET, "/api/gamemates/*/*/reviews").permitAll()
                        .requestMatchers(
                                // User & Auth
                                "/api/users/signup",
                                "/api/users/login",
                                "/api/auth/refresh",
                                "/api/auth/request-verification",
                                "/api/auth/request-password-reset",
                                "/api/auth/reset-password",

                                // Gamemate Public
                                "/api/gamemates/search",
                                "/api/gamemates/profile/**",
                                "/api/gamemates/popular",
                                "/api/gamemates/filter",
                                "/api/users/check-id",

                                // Swagger
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**"
                        ).permitAll()
                        .anyRequest().authenticated() // 위 경로 외 모든 요청은 인증 필요
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가

        return http.build();
    }

    // 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 인증 처리를 위한 AuthenticationManager 빈 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
