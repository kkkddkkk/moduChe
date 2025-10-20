package com.example.moduche.domain.login;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long userId;

  private String username;
  private String password;
  private String name;
  private String phone;
  private String email;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;


  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "role_id", referencedColumnName = "role_id")
  private Role role;
}