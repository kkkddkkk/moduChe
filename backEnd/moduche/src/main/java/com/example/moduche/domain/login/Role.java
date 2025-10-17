package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "role")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Role {
    @Id
    @Column(name = "role_id", nullable = false)
    private String roleId;
    @Column(name = "role_code", nullable = true)
    private String roleCode;
    @Column(name = "role_name", nullable = true)
    private String roleName;
}