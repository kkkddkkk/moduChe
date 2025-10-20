package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="community_post")
@Getter @Setter @NoArgsConstructor
public class CommunityPost {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long postId;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="community_id", foreignKey=@ForeignKey(name="fk_post_comm"))
  private Community community;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_post_user"))
  private User user;

  private String title;
  private String content;
  private LocalDateTime createdAt;
  private String hashTag;
}