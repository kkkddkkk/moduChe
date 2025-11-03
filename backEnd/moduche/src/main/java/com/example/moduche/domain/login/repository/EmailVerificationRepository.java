package com.example.moduche.domain.login.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.login.EmailVerification;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long>{

	//김도경: 만료된 코드 row 전체 삭제
    @Query("DELETE FROM EmailVerification e WHERE e.expireTime <= :now")
    int deleteExpiredCodes(@Param("now") LocalDateTime now);
    
    //김도경: 이메일로 row 찾기
    @Query("SELECT e FROM EmailVerification e WHERE e.email = :email")
    Optional<EmailVerification> findByEmail(@Param("email") String email);
}
