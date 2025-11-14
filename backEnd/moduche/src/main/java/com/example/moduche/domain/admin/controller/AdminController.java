package com.example.moduche.domain.admin.controller;

import com.example.moduche.domain.admin.dto.AdminResponse;
import com.example.moduche.domain.admin.dto.CreateAdminRequest;
import com.example.moduche.domain.admin.service.AdminAccountService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admins")
@PreAuthorize("hasRole('SUPER_ADMIN')") // 이 클래스의 모든 메서드는 SUPER_ADMIN만
public class AdminController {

    private final AdminAccountService service;

    public AdminController(AdminAccountService service) {
        this.service = service;
    }

    @GetMapping
    public Page<AdminResponse> listAdmins(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "createdFrom", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdTo,
            Pageable pageable
    ) {
        return service.list(q, status, createdFrom, createdTo, pageable);
    }

    @PostMapping
    public AdminResponse createAdmin(@RequestBody @Valid CreateAdminRequest request) {
    	System.out.println(">>> /api/admins createAdmin called, username=" + request.username());
        return service.createAdmin(request);
    }

    @PatchMapping("/{id}")
    public AdminResponse updateStatus(
            @PathVariable("id") Long id,
            @RequestParam(value = "status") String status
    ) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable("id") Long id) {
        service.deleteAdmin(id);
    }
}
