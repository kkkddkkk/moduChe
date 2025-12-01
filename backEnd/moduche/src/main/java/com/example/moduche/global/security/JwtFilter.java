package com.example.moduche.global.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.domain.login.repository.AccessibilityProfileRepository;
import com.example.moduche.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    		throws ServletException, IOException {
    	
    	String authorization = request.getHeader("Authorization");
    	
    	if(authorization==null || !authorization.startsWith("Bearer ")) {
    		filterChain.doFilter(request, response);
    		return;
    	}
    	
    	String token = authorization.substring(7);
    	
    	if(token != null && jwtTokenProvider.validateToken(token)) {			
    		String username = jwtTokenProvider.getUsername(token);
    		
    		/* 추가된 부분 */
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
    		
    		String role = "ROLE_"+jwtTokenProvider.getRole(token);
    		
    		List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
    		
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
    	}
    	filterChain.doFilter(request, response);
    }
}
