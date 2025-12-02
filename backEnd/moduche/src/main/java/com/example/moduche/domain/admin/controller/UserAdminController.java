package com.example.moduche.domain.admin.controller;

import com.example.moduche.domain.admin.dto.UserDto;
import com.example.moduche.domain.admin.dto.UserUpdateRequest;
import com.example.moduche.domain.admin.service.UserService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class UserAdminController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    /* 관리자 권한 체크 (BannerController 방식 적용) */
    private void checkAdmin(String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header missing");
        }

        String token = tokenHeader.replace("Bearer ", "").trim();
        String role = jwtTokenProvider.getRole(token);

        // ADMIN 관련 권한이면 모두 허용 → SUPER_ADMIN, ADMIN, ROLE_ADMIN 등
        if (!role.contains("ADMIN")) {
            throw new RuntimeException("관리자만 접근할 수 있습니다.");
        }

        System.out.println("[ADMIN CHECK] ROLE = " + role);
    }

    /* 회원 목록 조회 */
    @GetMapping
    public ResponseEntity<?> listUsers(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        checkAdmin(tokenHeader);

        Page<UserDto> users = userService.getMembers(search, status, page, size);
        return ResponseEntity.ok(new Response(StatusEnum.OK, "success", users));
    }

    /* 회원 상세 조회 */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("userId") Long userId
    ) {
        checkAdmin(tokenHeader);
        UserDto dto = userService.getUser(userId);
        return ResponseEntity.ok(new Response(StatusEnum.OK, "success", dto));
    }

    /* 회원 수정 */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("userId") Long userId,
            @RequestBody UserUpdateRequest request
    ) {
        checkAdmin(tokenHeader);
        UserDto updated = userService.updateUser(userId, request);
        return ResponseEntity.ok(new Response(StatusEnum.OK, "updated", updated));
    }

    /* 회원 삭제 */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("userId") Long userId
    ) {
        checkAdmin(tokenHeader);
        userService.deleteUser(userId);
        return ResponseEntity.ok(new Response(StatusEnum.OK, "deleted", null));
    }
}
