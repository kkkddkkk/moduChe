package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="community_post_comment")
@Data @NoArgsConstructor
public class CommunityPostComment {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long commentId;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="post_id", foreignKey=@ForeignKey(name="fk_comment_post"))
  private CommunityPost post;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_comment_user"))
  private User user;

  private String content;
  private LocalDateTime createdAt;
}