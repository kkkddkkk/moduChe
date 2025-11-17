package com.example.moduche.domain.notice;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notice_photo")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class NoticePhoto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long photoId; //1. 사진 고유 식별 번호.

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "notice_id")
	private Notice notice; //2. 소속 게시물.

	private String photoUrl;	//3. 이미지 경로.
	
	private LocalDateTime uploadedAt = LocalDateTime.now(); //4. 업로드 일시
	
    @PrePersist
    public void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void onUpdate() {
        this.uploadedAt = LocalDateTime.now();
    }
	
	
}
