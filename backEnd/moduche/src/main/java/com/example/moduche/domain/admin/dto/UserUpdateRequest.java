// src/main/java/com/example/moduche/domain/admin/dto/UserUpdateRequest.java
package com.example.moduche.domain.admin.dto;

public class UserUpdateRequest {

    private String name;
    private String email;
    private String phone;
    private String status;   // "ACTIVE", "SUSPENDED" 등 enum name 문자열
    private Long roleId;

    public UserUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }
}
