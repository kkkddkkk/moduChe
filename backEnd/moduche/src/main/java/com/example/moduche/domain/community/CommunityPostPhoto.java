package com.example.moduche.domain.community;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="community_post_photo")
@Getter @Setter @NoArgsConstructor
public class CommunityPostPhoto {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long photoId;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="post_id", foreignKey=@ForeignKey(name="fk_photo_post"))
  private CommunityPost post;

  private String photoUrl;
}