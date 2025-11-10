package com.example.moduche.domain.admin.dto;

import java.time.LocalDateTime;

public record AdminResponse(
        Long userId,
        String username,
        String name,
        String email,
        String phone,
        String status,
        Long roleId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AdminResponse fromDto(AdminRowDto dto) {
        return new AdminResponse(
                dto.userId(),
                dto.username(),
                dto.name(),
                dto.email(),
                dto.phone(),
                dto.status(),
                dto.roleId(),
                dto.createdAt(),
                dto.updatedAt()
        );
    }
}
