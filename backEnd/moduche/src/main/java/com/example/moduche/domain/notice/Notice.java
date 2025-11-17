package com.example.moduche.domain.notice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.example.moduche.domain.login.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notice")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Notice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long noticeId;

	private LocalDateTime createdAt;//작성시간
	private LocalDateTime updatedAt;//수정시간

	private String title;// 제목

	@JdbcTypeCode(SqlTypes.LONGVARCHAR)
	@Column(columnDefinition = "text")
	private String content;// 내용

	private boolean isPinned = false; //고정 여부
	private boolean isVisible = true;//활성화 여부

	private int viewCount = 0;//조회수

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private User createdBy;//작성자 user

	private String createdByName;//작성자 이름
	
	@OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<NoticePhoto> photos = new ArrayList<>();
	
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(this.isPinned) isVisible = true;
        if(!this.isVisible) this.isPinned = false;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if(this.isPinned) isVisible = true;
        if(!this.isVisible) this.isPinned = false;
    }
}
