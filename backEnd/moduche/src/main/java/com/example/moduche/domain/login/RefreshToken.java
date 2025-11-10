package com.example.moduche.domain.login;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;

@Entity @Table(name="refresh_token")
@Getter @Setter @NoArgsConstructor
@Builder @AllArgsConstructor
public class RefreshToken {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long tokenId;

  private String username; // 외래키가 아니라 평문(또는 userId)
  private String tokenHash;
  private LocalDateTime expire;
}