package com.example.moduche.domain.login;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.enums.VerifyStatus;

import lombok.*;

@Entity @Table(name="email_verification")
@Getter @Setter @NoArgsConstructor
@Builder
@AllArgsConstructor
public class EmailVerification {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  private Long userId;
  private String email;
  private String verificationCode;
  
  @Enumerated(EnumType.STRING) 
  private VerifyStatus verifyStatus;
  
  private LocalDateTime createdAt;
  private LocalDateTime expireTime;
}