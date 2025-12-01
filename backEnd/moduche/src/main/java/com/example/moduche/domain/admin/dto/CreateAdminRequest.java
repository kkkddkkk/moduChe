package com.example.moduche.domain.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAdminRequest(

        @NotBlank
        @Size(min = 5, max = 16) 
        String username,

        @NotBlank
        @Size(min = 6) 
        String password,

        @NotBlank
        @Size(max = 100)
        String name,

        String email,
        String phone
) {}
