package com.example.moduche.domain.tag;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="tag")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tag {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="tag_id")
  private Long tagId;

  @Column(nullable=false, unique=true, length=100)
  private String code;

  @Column(nullable=false, length=100)
  private String name;

  @Column(length=50)
  private String category;
}
