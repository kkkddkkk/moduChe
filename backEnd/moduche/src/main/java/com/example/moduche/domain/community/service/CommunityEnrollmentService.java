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
//	public boolean isMember(Long userId, Long communityId) {
//		return memberRepository.existsByUser_UserIdAndCommunity_CommunityId(userId, communityId);
//	}

	// 가입 신청 생성.
	@Transactional
	public Long createEnrollment(Long userId, Long communityId, CommunityEnrollmentRequestDTO dto) {

		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new IllegalArgumentException("커뮤니티 없음"));

		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("유저 없음"));

		// 기존 멤버 여부 조회.
		CommunityMember member = memberRepository.findByCommunity_CommunityIdAndUser_UserId(communityId, userId)
				.orElse(null);

		if (member != null) {

			// 이미 활동중인 멤버, 중복 신청 금지.
			if (member.getStatus() == CommunityMemberStatus.ACTIVE
					|| member.getStatus() == CommunityMemberStatus.SUSPENDED) {
				throw new IllegalArgumentException("이미 가입된 멤버입니다.");
			}

			// 탈퇴한 멤버에 의한 재가입 신청.
			if (member.getStatus() == CommunityMemberStatus.QUIT) {

				CommunityEnrollment enrollment = enrollmentRepository
						.findByCommunity_CommunityIdAndUser_UserId(communityId, userId).orElse(null);

				// 탈퇴시 enrollment를 지우는 하드 딜리트로 전환할경우.
				if (enrollment == null) {
					return enrollmentRepository.save(newPending(dto, community, user)).getId();
				}

				// 기존 신청서 덮어쓰기 및 상태 PENDING으로 전환 처리.
				enrollment.update(dto);
				enrollment.setStatus(CommunityEnrollmentStatus.PENDING);
				return enrollment.getId();
			}
		}

		// 아직 멤버가 아님 => enrollment 존재 여부 확인.
		CommunityEnrollment enrollment = enrollmentRepository
				.findByCommunity_CommunityIdAndUser_UserId(communityId, userId).orElse(null);

		if (enrollment != null) {

			switch (enrollment.getStatus()) {

			case PENDING:
				throw new IllegalArgumentException("이미 가입 신청을 하였습니다.");

			case APPROVED:
				throw new IllegalArgumentException("승인 완료된 회원입니다.");

			case DENIED:
				// 거절된 적 있는 사람 => 덮어쓰기 후 다시 PENDING, 관리자 승인 대기 처리.
				enrollment.update(dto);
				enrollment.setStatus(CommunityEnrollmentStatus.PENDING);
				return enrollment.getId();
			}
		}

		// 완전 신규 가입(거절 아님, 기존 회원 아님)신청 처리.
		return enrollmentRepository.save(newPending(dto, community, user)).getId();
	}

	// 신규 ENROLLMENT 엔티티 생성 공통 메서드.
	private CommunityEnrollment newPending(CommunityEnrollmentRequestDTO dto, Community community, User user) {
		CommunityEnrollment e = new CommunityEnrollment();
		e.setCommunity(community);
		e.setUser(user);
		e.update(dto); // ← 엔티티 내부 update(dto) 메서드 강력 추천
		e.setStatus(CommunityEnrollmentStatus.PENDING);
		return e;
	}

	// 운영자에 의한 가입 신청 목록 조회(+ 페이지네이션).
	public Page<EnrollmentManageDTO> getPendingEnrollments(Long communityId, Long ownerId, Pageable pageable) {
		// 운영자 검증
		validateOwner(communityId, ownerId);

		Page<CommunityEnrollment> page = enrollmentRepository.findByCommunity_CommunityIdAndStatus(communityId,
				CommunityEnrollmentStatus.PENDING, pageable);

		return page.map(
				enrollment -> new EnrollmentManageDTO(enrollment.getId(), enrollment.getName(), enrollment.getContact(),
						enrollment.getIntroduction(), enrollment.getMotivation(), enrollment.getCreatedAt()));

	}

	// 운영자에 의한 "상태별"(대기중, 승인, 미승인) 가입 신청 목록 조회(+ 페이지네이션).
	public Page<EnrollmentManageDTO> getEnrollmentsByStatus(Long communityId, Long ownerId,
			CommunityEnrollmentStatus status, Pageable pageable) {
		// 운영자 검증
		validateOwner(communityId, ownerId);

		Page<CommunityEnrollment> page = enrollmentRepository.findByCommunity_CommunityIdAndStatus(communityId, status,
				pageable);

		return page.map(
				enrollment -> new EnrollmentManageDTO(enrollment.getId(), enrollment.getName(), enrollment.getContact(),
						enrollment.getIntroduction(), enrollment.getMotivation(), enrollment.getCreatedAt()));
	}

	// 운영자에 의한 가입 신청 승인 처리.
	@Transactional
	public void approveEnrollment(Long enrollmentId, Long ownerId) {

		CommunityEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
				.orElseThrow(() -> new IllegalArgumentException("신청 없음"));

		// 운영자 권한 확인.
		validateOwner(enrollment.getCommunity().getCommunityId(), ownerId);

		// 신청 상태 변경.
		enrollment.setStatus(CommunityEnrollmentStatus.APPROVED);

		Long communityId = enrollment.getCommunity().getCommunityId();
		Long userId = enrollment.getUser().getUserId();

		// 기존 멤버 존재 여부 조회.
		CommunityMember existingMember = memberRepository.findByCommunity_CommunityIdAndUser_UserId(communityId, userId)
				.orElse(null);

		if (existingMember != null) {

			// 기존 활동 중인 멤버라면 승인 없음.
			if (existingMember.getStatus() == CommunityMemberStatus.ACTIVE
					|| existingMember.getStatus() == CommunityMemberStatus.SUSPENDED) {
				throw new IllegalStateException("이미 가입된 활동 멤버입니다.");
			}

			// 탈퇴한 회원 => 상태 ACTIVE로 복구.
			existingMember.setStatus(CommunityMemberStatus.ACTIVE);
			existingMember.setRole(CommunityMemberRole.MEMBER);
			existingMember.setJoinedAt(LocalDateTime.now());
			existingMember.setContact(enrollment.getContact());

			return;
		}

		// 신규 가입 => 멤버 엔티티 새로 생성.
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

	// 회원 가입 여부 및 등록 신청 제출 가능 여부 확인용 레코드.
	public record EnrollmentCheckResponse(boolean canApply, String reason) {
		public static EnrollmentCheckResponse allow() {
			return new EnrollmentCheckResponse(true, null);
		}

		public static EnrollmentCheckResponse deny(String reason) {
			return new EnrollmentCheckResponse(false, reason);
		}
	}

	public EnrollmentCheckResponse checkEnrollmentEligibility(Long userId, Long communityId) {

		// 이미 ACTIVE / SUSPENDED 멤버인지 확인.
		boolean isActiveOrSuspended = memberRepository.existsByUser_UserIdAndCommunity_CommunityIdAndStatusIn(userId,
				communityId, List.of(CommunityMemberStatus.ACTIVE, CommunityMemberStatus.SUSPENDED));

		if (isActiveOrSuspended) {
			return EnrollmentCheckResponse.deny("ACTIVE_MEMBER");
		}

		// 기존 신청 기록 확인.
		CommunityEnrollment existing = enrollmentRepository
				.findByCommunity_CommunityIdAndUser_UserId(communityId, userId).orElse(null);

		if (existing != null) {
			if (existing.getStatus() == CommunityEnrollmentStatus.PENDING) {
				return EnrollmentCheckResponse.deny("PENDING_ENROLLMENT");
			}
			if (existing.getStatus() == CommunityEnrollmentStatus.APPROVED) {

				boolean isQuitMember = memberRepository.existsByUser_UserIdAndCommunity_CommunityIdAndStatus(userId,
						communityId, CommunityMemberStatus.QUIT);

				if (isQuitMember) {
					return EnrollmentCheckResponse.allow();
				} else {
					return EnrollmentCheckResponse.deny("APPROVED_ENROLLMENT");
				}

			}
		}

		// QUIT 멤버 재가입 가능.
		boolean isQuitMember = memberRepository.existsByUser_UserIdAndCommunity_CommunityIdAndStatus(userId,
				communityId, CommunityMemberStatus.QUIT);

		if (isQuitMember) {
			return EnrollmentCheckResponse.allow();
		}

		// 완전 신규.
		return EnrollmentCheckResponse.allow();
	}
}
