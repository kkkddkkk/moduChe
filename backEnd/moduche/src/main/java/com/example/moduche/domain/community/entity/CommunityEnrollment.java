package com.example.moduche.domain.community.entity;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.dto.CommunityEnrollmentRequestDTO;
import com.example.moduche.domain.community.enums.CommunityEnrollmentStatus;
import com.example.moduche.domain.community.enums.CommunityScheduleType;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.login.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "community_enrollment")
@Getter
@Setter
@NoArgsConstructor
public class CommunityEnrollment {

	// 작성자: 고은설.
	// 기능: 동아리 가입 신청 저장용 엔티티.
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 신청한 커뮤니티.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "community_id")
	private Community community;

	// 신청한 유저.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	private String name; // 신청자 이름.
	private String contact; // 연락처.
	private String introduction; // 자기소개.
	private String motivation; // 가입 동기.

	@Enumerated(EnumType.STRING)
	private CommunityEnrollmentStatus status = CommunityEnrollmentStatus.PENDING;

	private String rejectReason; // 거절 사유 (DENIED일 때만).

	private LocalDateTime createdAt = LocalDateTime.now();

	public void update(CommunityEnrollmentRequestDTO dto) {
		this.name = dto.getName();
		this.contact = dto.getContact();
		this.introduction = dto.getIntroduction();
		this.motivation = dto.getMotivation();
		this.createdAt = LocalDateTime.now();
	}
}
