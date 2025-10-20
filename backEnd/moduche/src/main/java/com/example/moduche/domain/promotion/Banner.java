package com.example.moduche.domain.promotion;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="banner")
@Getter @Setter @NoArgsConstructor
public class Banner {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long bannerId;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="admin_id", foreignKey=@ForeignKey(name="fk_banner_admin"))
  private User admin;

  private String title;
  private String imageUrl;
  private String targetUrl;
  private String location;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private Integer orderIndex;
}