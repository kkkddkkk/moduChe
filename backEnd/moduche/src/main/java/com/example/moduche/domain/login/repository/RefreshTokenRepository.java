package com.example.moduche.domain.login.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.login.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    
	//김도경: username으로 RefreshToken 찾기
    @Query("SELECT r FROM RefreshToken r WHERE r.username = :username")
    Optional<RefreshToken> findByUserName(@Param("username") String username);
    
	//김도경: username으로 RefreshToken 지우기
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.username = :username")
    void deleteByUserName(@Param("username") String username);
}
