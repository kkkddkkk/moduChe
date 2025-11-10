package com.example.moduche.domain.admin.service;

import com.example.moduche.domain.admin.dto.AdminRowDto;
import com.example.moduche.domain.admin.dto.AdminResponse;
import com.example.moduche.domain.admin.dto.CreateAdminRequest;
import com.example.moduche.domain.admin.repository.AdminUserRepository;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminAccountService {

    private final AdminUserRepository repo;
    private final UserRepository userRepository;

    public AdminAccountService(AdminUserRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    // 관리자 목록 조회
    public Page<AdminResponse> list(String q, String status,
                                    LocalDateTime createdFrom, LocalDateTime createdTo,
                                    Pageable pageable) {
        return repo.findAdmins(q, status, createdFrom, createdTo, pageable)
                .map(this::toDto)
                .map(AdminResponse::fromDto);
    }

    private AdminRowDto toDto(User u) {
        Long roleId = (u.getRole() != null) ? u.getRole().getRoleId() : null;
        String s = (u.getStatus() != null) ? u.getStatus().name() : null;

        return new AdminRowDto(
                u.getUserId(),
                u.getUsername(),
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                s,
                roleId,
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }

    // 관리자 생성
    public AdminResponse createAdmin(CreateAdminRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(request.password());
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());

        // Role ID만 설정
        Long roleId = request.roleId() != null ? request.roleId() : 2L; // ADMIN 기본 2
        Role role = new Role();
        role.setRoleId(roleId);
        user.setRole(role);

        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return AdminResponse.fromDto(toDto(saved));
    }

    // 관리자 상태 변경
    public AdminResponse updateStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다. id=" + id));

        try {
            user.setStatus(UserStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 상태값입니다: " + status);
        }

        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return AdminResponse.fromDto(toDto(saved));
    }

    // 관리자 삭제
    public void deleteAdmin(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("관리자를 찾을 수 없습니다. id=" + id);
        }
        userRepository.deleteById(id);
    }
}
