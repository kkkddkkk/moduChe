package com.example.moduche.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.moduche.domain.community.dto.CommunityEnrollmentRequestDTO;
import com.example.moduche.domain.community.dto.EnrollmentManageDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityEnrollment;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.enums.CommunityEnrollmentStatus;
import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;
import com.example.moduche.domain.community.repository.CommunityEnrollmentRepository;
import com.example.moduche.domain.community.repository.CommunityMemberRepository;
import com.example.moduche.domain.community.repository.CommunityRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityEnrollmentService {

	private final CommunityEnrollmentRepository enrollmentRepository;
	private final CommunityMemberRepository memberRepository;
	private final CommunityRepository communityRepository;
	private final UserRepository userRepository;

	// 동아리 소유주(Owner) 여부 검증.
	private Community validateOwner(Long communityId, Long ownerId) {
		boolean isOwner = communityRepository.existsByCommunityIdAndOwner_UserId(communityId, ownerId);
		if (!isOwner) {
			throw new IllegalArgumentException("해당 커뮤니티의 운영자가 아닙니다.");
		}
		return communityRepository.findById(communityId).orElseThrow(() -> new IllegalArgumentException("커뮤니티 없음"));
	}

	// 가입 여부 확인.
	public boolean isMember(Long userId, Long communityId) {
		return memberRepository.existsByUser_UserIdAndCommunity_CommunityId(userId, communityId);
	}

	// 가입 신청 생성.
	public Long createEnrollment(Long userId, Long communityId, CommunityEnrollmentRequestDTO dto) {

		if (isMember(userId, communityId)) {
			throw new IllegalArgumentException("이미 가입된 멤버입니다.");
		}

		if (enrollmentRepository.existsByUser_UserIdAndCommunity_CommunityId(userId, communityId)) {
			throw new IllegalArgumentException("이미 가입 신청을 하였습니다.");
		}

		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new IllegalArgumentException("커뮤니티 없음"));

		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 없음"));

		CommunityEnrollment enrollment = new CommunityEnrollment();
		enrollment.setCommunity(community);
		enrollment.setUser(user);
		enrollment.setName(dto.getName());
		enrollment.setContact(dto.getContact());
		enrollment.setIntroduction(dto.getIntroduction());
		enrollment.setMotivation(dto.getMotivation());
		enrollment.setStatus(CommunityEnrollmentStatus.PENDING);

		return enrollmentRepository.save(enrollment).getId();
	}

	// 운영자에 의한 가입 신청 목록 조회(+ 페이지네이션).
	public Page<EnrollmentManageDTO> getPendingEnrollments(Long communityId, Long ownerId, Pageable pageable) {
		// 운영자 검증
		validateOwner(communityId, ownerId);

	    Page<CommunityEnrollment> page = enrollmentRepository
	            .findByCommunity_CommunityIdAndStatus(
	                    communityId,
	                    CommunityEnrollmentStatus.PENDING,
	                    pageable
	            );

	    return page.map(enrollment ->
	            new EnrollmentManageDTO(
	                    enrollment.getId(),
	                    enrollment.getName(),
	                    enrollment.getContact(),
	                    enrollment.getIntroduction(),
	                    enrollment.getMotivation(),
	                    enrollment.getCreatedAt()
	            )
	    );
		
	}

	// 운영자에 의한 "상태별"(대기중, 승인, 미승인) 가입 신청 목록 조회(+ 페이지네이션).
	public Page<EnrollmentManageDTO> getEnrollmentsByStatus(Long communityId, Long ownerId, CommunityEnrollmentStatus status, Pageable pageable) {
		// 운영자 검증
		validateOwner(communityId, ownerId);

		Page<CommunityEnrollment> page = enrollmentRepository.findByCommunity_CommunityIdAndStatus(communityId, status,
				pageable);
		
		return page.map(enrollment ->
        new EnrollmentManageDTO(
                enrollment.getId(),
                enrollment.getName(),
                enrollment.getContact(),
                enrollment.getIntroduction(),
                enrollment.getMotivation(),
                enrollment.getCreatedAt()
        )
);
	}

	// 운영자에 의한 가입 신청 승인 처리.
	@Transactional
	public void approveEnrollment(Long enrollmentId, Long ownerId) {
		CommunityEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
				.orElseThrow(() -> new IllegalArgumentException("신청 없음"));

		// 운영자 검증
		validateOwner(enrollment.getCommunity().getCommunityId(), ownerId);

		enrollment.setStatus(CommunityEnrollmentStatus.APPROVED);

		// 멤버 생성
		CommunityMember member = new CommunityMember();
		member.setCommunity(enrollment.getCommunity());
		member.setUser(enrollment.getUser());
		member.setRole(CommunityMemberRole.MEMBER);
		member.setStatus(CommunityMemberStatus.ACTIVE);
		member.setContact(enrollment.getContact());
		member.setJoinedAt(LocalDateTime.now());

		memberRepository.save(member);
	}

	// 운영자에 의한 가입 신청 거절 처리.
	@Transactional
	public void denyEnrollment(Long enrollmentId, Long ownerId, String reason) {
		CommunityEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
				.orElseThrow(() -> new IllegalArgumentException("신청 없음"));

		// 운영자 검증.
		validateOwner(enrollment.getCommunity().getCommunityId(), ownerId);

		enrollment.setStatus(CommunityEnrollmentStatus.DENIED);
		enrollment.setRejectReason(reason);
	}
}
