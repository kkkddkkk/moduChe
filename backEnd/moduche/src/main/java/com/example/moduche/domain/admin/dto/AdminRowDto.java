package com.example.moduche.domain.admin.dto;

import java.time.LocalDateTime;

public record AdminRowDto(
        Long userId,
        String username,
        String name,
        String email,
        String phone,
        String status,
        Long roleId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
