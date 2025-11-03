package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="role")
@Getter @Setter @NoArgsConstructor
public class Role {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)@Column(name = "role_id")    
  private Long roleId;            // 예: 'CENTER_USER','ADMIN'

  @Column(name = "role_code")
  private String roleCode;

  @Column(name = "role_name")
  private String roleName;
}