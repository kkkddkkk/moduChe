package com.example.moduche.global.security;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.repository.UserRepository;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        // 1) 토큰 없으면 → 그냥 익명으로 다음 필터
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(7);

        try {
            // 2) 토큰이 있고, 유효한 경우에만 인증 시도
            if (token != null && jwtTokenProvider.validateToken(token)) {

                String username = jwtTokenProvider.getUsername(token);

                // 🔹 DB에서 유저 조회
                User user = userRepository.findByUserName(username).orElse(null);

                // 삭제된 계정 (DB에 없음)
                if (user == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("text/plain;charset=UTF-8");
                    response.getWriter().write("존재하지 않는 계정입니다.");
                    return;
                }

                // 정지된 계정
                if (user.getStatus() == UserStatus.SUSPENDED) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("text/plain;charset=UTF-8");
                    response.getWriter().write("정지된 계정입니다.");
                    return;
                }

                String role = "ROLE_" + jwtTokenProvider.getRole(token);

                List<GrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority(role));

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            // validateToken이 false이면 → 인증만 안 세팅하고 그냥 넘어감 (익명)
        } catch (JwtException | IllegalArgumentException e) {
            // 토큰 깨짐 / 만료 등 → 로그만 찍고, 익명으로 계속 진행
            System.out.println("❗ invalid JWT token: " + e.getMessage());
        }

        // 3) 어쨌든 다음 필터로 넘김
        filterChain.doFilter(request, response);
    }
}
