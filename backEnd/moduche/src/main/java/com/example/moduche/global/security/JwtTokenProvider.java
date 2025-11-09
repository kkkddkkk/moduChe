package com.example.moduche.global.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.repository.AccessibilityProfileRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class JwtTokenProvider {

	@Value("${JWT_KEY}")
	private String jwtKey;
	// 토큰 유지시간 (기본 30분)
    private final long accessTokenValidityMs = 1000L * 60 * 15; // 15분
    private final long refreshTokenValidityMs = 1000L * 60 * 60 * 24 * 14; // 14일
        
    private SecretKey secretKey() {//encode
    	//hmacShaKeyFor-> byte 배열로 Secretkey 생성해줌.
    	return Keys.hmacShaKeyFor(jwtKey.getBytes(StandardCharsets.UTF_8));
    }
    
    private SecretKey getSigningKey() {//decode
        return Keys.hmacShaKeyFor(jwtKey.getBytes(StandardCharsets.UTF_8));
    }
	
	//토큰 생성
	public String createAccessToken(User user) {
		Claims claims = Jwts.claims().setSubject(user.getUsername());
		claims.put("role", user.getRole().getRoleCode());

		Date now = new Date();
		//토큰 유효시간
		Date valid = new Date(now.getTime()+accessTokenValidityMs);
		
		//hmacShaKeyFor-> byte 배열로 Secretkey 생성해줌.
		String token = Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(valid)
				.signWith(secretKey(), SignatureAlgorithm.HS256)
				.compact();
		
		return token;
	}
	
	public String createRefreshToken(User user) {
		Claims claims = Jwts.claims().setSubject(user.getUsername());
		claims.put("role", user.getRole().getRoleCode());

		Date now = new Date();
		//토큰 유효시간
		Date valid = new Date(now.getTime()+refreshTokenValidityMs);
		
		//hmacShaKeyFor-> byte 배열로 Secretkey 생성해줌.
		String token = Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(valid)
				.signWith(secretKey(), SignatureAlgorithm.HS256)
				.compact();
		
		return token;
	}
	
	//refreshToken 검증
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
			return true;
		}catch(JwtException | IllegalArgumentException e) {
			return false;
		}
	}
	
    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
    public String getRole(String token) {
        return (String)Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().get("role");
    }

    public Date getExpiration(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getExpiration();
    }
}
