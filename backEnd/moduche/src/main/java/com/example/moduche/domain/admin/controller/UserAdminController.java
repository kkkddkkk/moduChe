// src/main/java/com/example/moduche/domain/admin/controller/UserAdminController.java
package com.example.moduche.domain.admin.controller;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.admin.dto.UserDto;
import com.example.moduche.domain.admin.dto.UserUpdateRequest;
import com.example.moduche.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserRepository userRepository;

    /**
     * 회원 목록 조회
     * GET /api/users?page=0&size=5&search=...&status=...&role=...
     */
    @GetMapping
    @Transactional(readOnly = true) // ★ 전체 처리 구간에 세션 유지
    public Page<UserDto> listUsers(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "role",   required = false) String role,
            Pageable pageable
    ) {
        // TODO: search/status/role 필터는 나중에 구현
        Page<User> page = userRepository.findAll(pageable);

        // ★ 여기서 role 미리 초기화 → LazyInitializationException 방지
        page.getContent().forEach(u -> {
            if (u.getRole() != null) {
                Hibernate.initialize(u.getRole());
            }
        });

        // ★ 트랜잭션 안에서 DTO 변환
        return page.map(UserDto::from);
    }

    /**
     * 회원 단건 조회
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true) // ★ 세션 유지
    public UserDto getUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다. id=" + id));

        // ★ role 초기화
        if (user.getRole() != null) {
            Hibernate.initialize(user.getRole());
        }

        return UserDto.from(user);
    }

    /**
     * 회원 정보 수정 (상태 토글 등)
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    @Transactional // 쓰기 작업
    public UserDto updateUser(
            @PathVariable("id") Long id,
            @RequestBody UserUpdateRequest request
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다. id=" + id));

        // 이름 / 이메일 / 전화
        if (request.getName() != null)  user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        // 상태 변경
        if (request.getStatus() != null) {
            try {
                UserStatus st = UserStatus.valueOf(request.getStatus());
                user.setStatus(st);
            } catch (IllegalArgumentException ignored) {
                // 잘못된 status 값이면 무시
            }
        }

        // 역할 변경 (지금은 실제 변경 로직은 주석)
        if (request.getRoleId() != null) {
            Role role = user.getRole();
            if (role != null && !request.getRoleId().equals(role.getRoleId())) {
                // TODO: RoleRepository 사용해서 role 변경하고 싶으면 여기서 처리
                // Role newRole = roleRepository.findById(request.getRoleId()).orElseThrow(...);
                // user.setRole(newRole);
            }
        }

        User saved = userRepository.save(user);

        if (saved.getRole() != null) {
            Hibernate.initialize(saved.getRole());
        }

        return UserDto.from(saved);
    }

    /**
     * 회원 삭제
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    @Transactional
    public void deleteUser(@PathVariable("id") Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("회원이 존재하지 않습니다. id=" + id);
        }
        userRepository.deleteById(id);
    }
}
