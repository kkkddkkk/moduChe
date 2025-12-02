package com.example.moduche.domain.community.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.moduche.domain.community.dto.MetaInfoEditRequestDTO;
import com.example.moduche.domain.community.enums.CommunityScheduleType;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.login.User;

import lombok.*;

@Entity
@Table(name = "community")
@Getter
@Setter
@NoArgsConstructor
public class Community {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long communityId; // 1. 동아리 식별 번호.

	private String name; // 2. 동아리 이름.
	private String founder; // 3. 설립자 이름.
	private String purpose; // 4. 설립 목적.
	private int maxMember; // 5. 최대 모집 인원.

	// 6. 정기 / 비정기.
	@Enumerated(EnumType.STRING)
	private CommunityScheduleType scheduleType = CommunityScheduleType.OCCASIONAL;

	private String scheduleDetail; // 7. 활동 날짜 상세.

	private String address; // 8. 기본 주소.
	private String addressDetail; // 9. 상세 주소.
	private String representativeImage; // 10. 대표 이미지 (썸네일).

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owner_user_id", foreignKey = @ForeignKey(name = "fk_comm_owner"), nullable = true)
	private User owner; // 11. 소유주 정보.

	@Enumerated(EnumType.STRING)
	private CommunityStatus status = CommunityStatus.REGISTERED; // 12. 관리자 승인 대기.

	private LocalDateTime createdAt = LocalDateTime.now(); // 13. 등록일.

	@Column(precision = 38, scale = 15)
	private BigDecimal geoLat;
	@Column(precision = 38, scale = 15)
	private BigDecimal geoLng;
	
	//검색 조건에 필요한 join
	@OneToMany(mappedBy = "community", fetch = FetchType.LAZY)
	private List<CommunityPost> posts = new ArrayList<>();
	

}