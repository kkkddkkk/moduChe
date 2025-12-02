package com.example.moduche.domain.admin.service;

import com.example.moduche.domain.admin.dto.UserDto;
import com.example.moduche.domain.admin.dto.UserUpdateRequest;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.domain.login.repository.RoleRepository;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public Page<UserDto> getMembers(String search, String status, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        UserStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            try {
                statusEnum = UserStatus.valueOf(status.toUpperCase());
            } catch (Exception ignored) {}
        }

        Page<User> users = userRepository.searchMembers(
                (search != null && !search.isBlank()) ? search.trim() : null,
                statusEnum,
                List.of(3L, 4L),
                pageable
        );

        users.forEach(u -> {
            if (u.getRole() != null) Hibernate.initialize(u.getRole());
        });

        return users.map(UserDto::from);
    }

    @Transactional(readOnly = true)
    public UserDto getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        if (user.getRole() != null) Hibernate.initialize(user.getRole());

        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        if (request.getStatus() != null) {
            try {
                UserStatus st = UserStatus.valueOf(request.getStatus().toUpperCase());
                user.setStatus(st);
            } catch (Exception ignored) {}
        }

        if (request.getRoleId() != null) {
            Role newRole = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found"));
            user.setRole(newRole);
        }

        user.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);

        if (saved.getRole() != null) Hibernate.initialize(saved.getRole());
        return UserDto.from(saved);
    }

    @Transactional
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        if (user.getRole().getRoleId() <= 2) {
            throw new IllegalArgumentException("관리자 계정은 삭제할 수 없습니다.");
        }

        userRepository.delete(user);
    }
}
