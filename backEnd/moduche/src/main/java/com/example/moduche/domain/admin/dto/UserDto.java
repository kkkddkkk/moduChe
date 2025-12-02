package com.example.moduche.domain.admin.dto;

import com.example.moduche.domain.login.User;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {

    @JsonProperty("userId")
    private Long userId;

    private String username;
    private String name;
    private String email;
    private String phone;

    // 프론트에서 사용 중
    private String birth;

    @JsonProperty("roleId")
    private Long roleId;

    @JsonProperty("roleCode")
    private String roleCode;

    private String roleName;

    private String status;

    // 프론트에서 문자열로 사용하므로 String으로 변환
    private String createdAt;

    public UserDto() {}

    public UserDto(Long userId,
                   String username,
                   String name,
                   String email,
                   String phone,
                   String birth,
                   Long roleId,
                   String roleCode,
                   String roleName,
                   String status,
                   String createdAt) {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birth = birth;
        this.roleId = roleId;
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static UserDto from(User u) {
        if (u == null) return null;

        Long rId = null;
        String rCode = null;
        String rName = null;

        if (u.getRole() != null) {
            rId = u.getRole().getRoleId();
            rCode = u.getRole().getRoleCode();
            rName = u.getRole().getRoleName();
        }

        String s = (u.getStatus() != null) ? u.getStatus().name() : null;

        return new UserDto(
                u.getUserId(),
                u.getUsername(),
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                null, // User 엔티티에 birth 필드가 없으므로 null 유지
                rId,
                rCode,
                rName,
                s,
                u.getCreatedAt() != null ? u.getCreatedAt().toString() : null
        );
    }

    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getBirth() { return birth; }
    public Long getRoleId() { return roleId; }
    public String getRoleCode() { return roleCode; }
    public String getRoleName() { return roleName; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }
}
