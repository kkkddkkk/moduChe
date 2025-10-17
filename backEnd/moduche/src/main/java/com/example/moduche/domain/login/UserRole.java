package com.example.moduche.domain.login;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "userrole")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "role_id", nullable = false)
    private String roleId;
    @Column(name = "assigned_at", nullable = true)
    private LocalDateTime assignedAt;
}