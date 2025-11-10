package com.example.moduche.domain.admin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import com.example.moduche.domain.login.User;

public class AdminDto {
    @JsonProperty("user_id")
    private Long userId;

    public Long getId() { return userId; }

    private String name;
    private String email;
    private String username;
    private String phone;

    @JsonProperty("role_id")
    private Long roleId;

    private String status;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public AdminDto() {}

    public AdminDto(Long userId, String name, String email, String username, String phone,
                    Long roleId, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.username = username;
        this.phone = phone;
        this.roleId = roleId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // getters / setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static AdminDto fromUser(User u) {
        if (u == null) return null;
        Long rId = (u.getRole() != null) ? u.getRole().getRoleId() : null;
        String s = (u.getStatus() != null) ? u.getStatus().name() : null;
        return new AdminDto(
                u.getUserId(),
                u.getName(),
                u.getEmail(),
                u.getUsername(),
                u.getPhone(),
                rId,
                s,
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }
}
