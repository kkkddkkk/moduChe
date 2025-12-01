package com.example.moduche.domain.admin.controller;

import com.example.moduche.domain.admin.dto.AdminResponse;
import com.example.moduche.domain.admin.dto.CreateAdminRequest;
import com.example.moduche.domain.admin.service.AdminAccountService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminAccountService service;

    public AdminController(AdminAccountService service) {
        this.service = service;
    }

    private Authentication auth() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private void requireAdmin() {
        boolean ok = auth().getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().contains("ADMIN"));
        if (!ok) throw new RuntimeException("관리자만 접근 가능");
    }

    private void requireSuperAdmin() {
        boolean ok = auth().getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        if (!ok) throw new RuntimeException("SUPER_ADMIN만 접근 가능");
    }

    @GetMapping
    public Page<AdminResponse> listAdmins(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable
    ) {
        requireAdmin(); // SUPER_ADMIN, ADMIN 모두 허용
        return service.list(q, status, null, null, pageable);
    }

    @PostMapping
    public AdminResponse createAdmin(@RequestBody @Valid CreateAdminRequest request) {
        requireSuperAdmin(); 
        return service.createAdmin(request);
    }

    @PatchMapping("/{id}")
    public AdminResponse updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status
    ) {
        requireSuperAdmin();
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable("id") Long id) {
        requireSuperAdmin();
        service.deleteAdmin(id);
    }
}
