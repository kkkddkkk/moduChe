package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="community")
@Getter @Setter @NoArgsConstructor
public class Community {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long communityId;

  private String title;
  private String description;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="owner_user_id", foreignKey=@ForeignKey(name="fk_comm_owner"))
  private User owner;

  private LocalDateTime createdAt;
}