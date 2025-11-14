package com.example.moduche.domain.admin.dto;

import com.example.moduche.domain.login.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class UserDto {

    @JsonProperty("userId")
    private Long userId;

    private String username;
    private String name;
    private String email;
    private String phone;

    @JsonProperty("roleId")
    private Long roleId;

    @JsonProperty("roleCode")
    private String roleCode;

    private String status;

    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(Long userId,
                   String username,
                   String name,
                   String email,
                   String phone,
                   Long roleId,
                   String roleCode,
                   String status,
                   LocalDateTime createdAt) {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roleId = roleId;
        this.roleCode = roleCode;
        this.status = status;
        this.createdAt = createdAt;
    }

    // --- getters / setters ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }

    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // --- 변환 메서드 ---
    public static UserDto from(User u) {
        if (u == null) return null;

        // role은 컨트롤러에서 Hibernate.initialize()로 미리 초기화됨
        Long rId = null;
        String rCode = null;
        if (u.getRole() != null) {
            rId = u.getRole().getRoleId();
            rCode = u.getRole().getRoleCode();
        }

        String s = (u.getStatus() != null) ? u.getStatus().name() : null;

        return new UserDto(
                u.getUserId(),
                u.getUsername(),
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                rId,
                rCode,
                s,
                u.getCreatedAt()
        );
    }
}
