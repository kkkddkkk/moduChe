package com.example.moduche.domain.login;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "user")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "username", nullable = true)
    private String username;
    @Column(name = "password", nullable = true)
    private String password;
    @Column(name = "name", nullable = true)
    private String name;
    @Column(name = "phone", nullable = true)
    private String phone;
    @Column(name = "email", nullable = true)
    private String email;
    @Column(name = "role", nullable = true)
    private String role;
    @Column(name = "status", nullable = true)
    private String status;
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;
}