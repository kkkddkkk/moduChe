package com.example.moduche.domain.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateAdminRequest(
        @NotBlank
        @Size(min = 3, max = 50)
        String username,

        @NotBlank
        @Size(min = 6)
        String password,

        @NotBlank
        @Size(max = 100)
        String name,

        String email,
        String phone,
        Integer roleId // optional, 없으면 기본 ADMIN(2) 설정
) {}
