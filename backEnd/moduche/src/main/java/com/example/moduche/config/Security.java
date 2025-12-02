package com.example.moduche.config;

import com.example.moduche.global.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class Security {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/",
                        "/api/auth/**",
                        "/api/signIn/**",
                        "/api/email/**",
                        "/api/find/**",
                        "/api/noticeForAll/**",
                        "/api/main/**",
                        "/api/course/**",
                        "/api/search/**",
                        "/api/payment/**",
                        "/api/banner/**",
                        "/api/redis/**",
                        "/api/users/**",
                        "/api/reports/**",
                        "/api/admin/reports/**",
                        "/api/admin/inquiries/**",
                        "/api/admins/**",
                        "/api/admin/dashboard/**",
                        "/api/facilities/**"
                ).permitAll()

                .requestMatchers(HttpMethod.GET, "/api/inquiries/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/inquiries/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/inquiries/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/inquiries/**").authenticated()

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
        	    "http://localhost:3000",
        	    "https://moduche.vercel.app",
        	    "https://moduche-vqlbv7vw0-teamgpts-projects.vercel.app"
        	));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
