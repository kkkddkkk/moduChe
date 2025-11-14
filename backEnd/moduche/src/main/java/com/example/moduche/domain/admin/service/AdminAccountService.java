package com.example.moduche.domain.admin.service;

import com.example.moduche.domain.admin.dto.AdminRowDto;
import com.example.moduche.domain.admin.dto.AdminResponse;
import com.example.moduche.domain.admin.dto.CreateAdminRequest;
import com.example.moduche.domain.admin.repository.AdminUserRepository;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.domain.login.repository.RoleRepository;
import com.example.moduche.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
public class AdminAccountService {

    private final AdminUserRepository repo;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountService(AdminUserRepository repo,
                               UserRepository userRepository,
                               RoleRepository roleRepository,
                               PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 관리자 목록 조회 (읽기 전용)
    @Transactional(readOnly = true)
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

    // 관리자 생성: 항상 role_id = 2 (일반 관리자)로 고정
    @Transactional
    public AdminResponse createAdmin(CreateAdminRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password())); // 암호화
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());

        // ★ role_id = 2 강제 지정
        Long adminRoleId = 2L;
        Role role = roleRepository.findById(adminRoleId)
                .orElseThrow(() -> new IllegalStateException("roles 테이블에 role_id=2가 없습니다."));
        user.setRole(role);

        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return AdminResponse.fromDto(toDto(saved));
    }

    // 관리자 상태 변경
    @Transactional
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
    @Transactional
    public void deleteAdmin(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("관리자를 찾을 수 없습니다. id=" + id);
        }
        userRepository.deleteById(id);
    }
}
