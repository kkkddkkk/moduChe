package com.example.moduche.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.community.dto.MemberManageDTO;
import com.example.moduche.domain.community.dto.MyCommunityManageDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;
import com.example.moduche.domain.community.repository.CommunityMemberRepository;
import com.example.moduche.domain.community.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityMemberService {

	private final CommunityMemberRepository memberRepository;
	private final CommunityRepository communityRepository;

	// 운영자 검증 함수.
	private void validateOwner(Long communityId, Long ownerId) {
		if (!communityRepository.existsByCommunityIdAndOwner_UserId(communityId, ownerId)) {
			throw new IllegalArgumentException("해당 커뮤니티 운영자가 아닙니다.");
		}
	}

	// 동아리 회원 목록 조회 (+ 페이지네이션).
	public Page<CommunityMember> getMembers(Long communityId, Long ownerId, Pageable pageable) {
		validateOwner(communityId, ownerId);
		return memberRepository.findByCommunity_CommunityId(communityId, pageable);
	}

	// 동아리 회원 "상태별" 목록 조회 (+ 페이지네이션.)
	public Page<MemberManageDTO> getMembersByStatus(Long communityId, Long ownerId, CommunityMemberStatus status,
			Pageable pageable) {

		validateOwner(communityId, ownerId);

		Page<MemberManageDTO> page = memberRepository.findMemberDTOs(communityId, status, pageable);

		return page;
	}

	// 일반 회원에 의한 내가 멤버로 소속된 동아리 전체 조회 (+페이지네이션).
	public Page<MyCommunityManageDTO> getUserCommunityList(Long userId, boolean activeOnly, String search,
			Pageable pageable) {
		List<CommunityMemberStatus> statuses;

		if (activeOnly) {
			statuses = List.of(CommunityMemberStatus.ACTIVE, CommunityMemberStatus.SUSPENDED);
		} else {
			statuses = List.of(CommunityMemberStatus.ACTIVE, CommunityMemberStatus.SUSPENDED,
					CommunityMemberStatus.QUIT);
		}

		return memberRepository.findMyCommunityAsMember(userId, statuses, search, pageable);
	}

	// 동아리 회원 등급 변경 (ADMIN/MANAGER/MEMBER).
	@Transactional
	public void updateRole(Long communityId, Long memberId, Long ownerId, CommunityMemberRole newRole) {
		validateOwner(communityId, ownerId);

		CommunityMember member = memberRepository.findByIdAndCommunity_CommunityId(memberId, communityId)
				.orElseThrow(() -> new IllegalArgumentException("회원 없음"));

		if (member.getRole() == CommunityMemberRole.ADMIN) {
			// 운영자 멤버에 대한 등급 변경 불가능.
			throw new CommunityPermissionException("운영자 본인은 등급을 변경할 수 없습니다.");
		}

		if (newRole == CommunityMemberRole.ADMIN) {
			// 역시 운영자 등급에 대한 권한 부여 불가능.
			throw new CommunityPermissionException("다른 회원에게 운영자 권한을 부여할 수 없습니다.");
		}

		member.setRole(newRole);
	}

	// 동아리 회원 계정 상태 변경 (ACTIVE / QUIT / SUSPENDED).
	@Transactional
	public void updateStatus(Long communityId, Long memberId, Long ownerId, CommunityMemberStatus newStatus,
			String reason) {

		CommunityMember member = memberRepository.findByIdAndCommunity_CommunityId(memberId, communityId)
				.orElseThrow(() -> new IllegalArgumentException("회원 없음"));

		// 정지 처리 => 운영자만 가능, 이유 삽입 필수.
		if (newStatus == CommunityMemberStatus.SUSPENDED) {
			validateOwner(communityId, ownerId);
			member.setStatus(CommunityMemberStatus.SUSPENDED);
			member.setSuspendedAt(LocalDateTime.now());
			member.setSuspendReason(reason);

		} else if (newStatus == CommunityMemberStatus.QUIT) {
			// 탈퇴 처리 => 회원 본인에 의해서 가능, 이유 삽입 필수.
			member.setStatus(CommunityMemberStatus.QUIT);
			member.setQuitAt(LocalDateTime.now());
			member.setQuitReason(reason);
		} else if (newStatus == CommunityMemberStatus.ACTIVE) {
			// 재활성화 처리.
			member.setStatus(CommunityMemberStatus.ACTIVE);

			// 탈퇴 -> 활동 == 탈퇴 후 재가입.
			if (member.getStatus() == CommunityMemberStatus.QUIT) {
				member.setQuitAt(null);
				member.setQuitReason(null);
			}

			// 정지 -> 활동 == 활동재개.
			if (member.getStatus() == CommunityMemberStatus.SUSPENDED) {
				member.setSuspendedAt(null);
				member.setSuspendReason(null);
			}
		}

		memberRepository.save(member);
	}

	// 동아리 회원 본인에 의한 동아리 가입 탈퇴 (ACTIVE -> QUIT).
	@Transactional
	public void quitCommunity(Long communityId, Long userId, String reason) {

		CommunityMember member = memberRepository.findByCommunity_CommunityIdAndUser_UserId(communityId, userId)
				.orElseThrow(() -> new IllegalArgumentException("회원 없음"));

		member.setStatus(CommunityMemberStatus.QUIT);
		member.setQuitAt(LocalDateTime.now());
		member.setQuitReason(reason);

		memberRepository.save(member);
	}

	// 해당 유저가 회원으로 존재하는 동아리가 하나라도 있는지 확인용(ACTIVE/SUSPENDED만).
	public boolean hasCommunityAsMember(Long userId) {
		return memberRepository.existsByUser_UserIdAndStatusIn(userId,
				List.of(CommunityMemberStatus.ACTIVE, CommunityMemberStatus.SUSPENDED));
	}

	@Transactional
	public void transferOwner(Long communityId, Long currentUserId, Long targetMemberId) {
		// 동아리 조회.
		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

		// 현재 운영자가 맞는지 검증.
		if (!community.getOwner().getUserId().equals(currentUserId)) {
			throw new IllegalArgumentException("대표 운영자만 권한을 이양할 수 있습니다.");
		}

		// 본인의 Member 엔티티 찾기.
		CommunityMember currentMember = memberRepository
				.findByCommunity_CommunityIdAndUser_UserId(communityId, currentUserId)
				.orElseThrow(() -> new IllegalArgumentException("운영자 멤버 정보를 찾을 수 없습니다."));

		// 권한 이양 대상 멤버 찾기.
		CommunityMember newOwnerMember = memberRepository.findById(targetMemberId)
				.orElseThrow(() -> new IllegalArgumentException("대상 멤버를 찾을 수 없습니다."));

		// 대상이 같은 동아리 소속인지 확인.
		if (!newOwnerMember.getCommunity().getCommunityId().equals(communityId)) {
			throw new IllegalArgumentException("해당 멤버는 이 동아리 소속이 아닙니다.");
		}

		// 유효성 검증 (본인을 제외한 Active 회원 1명 이상 있어야 함).
		if (!isCanSwitch(communityId, currentMember.getId())) {
			throw new IllegalArgumentException("책임을 이양할 대상이 없어 등급 변경이 불가합니다.");
		}

		// 기존 운영자 => 일반 회원.
		currentMember.setRole(CommunityMemberRole.MEMBER);

		// 새 운영자 => 운영자.
		newOwnerMember.setRole(CommunityMemberRole.ADMIN);

		// 커뮤니티 Owner 새 운영자로 갱신.
		community.setOwner(newOwnerMember.getUser());
	}

	// 나 말고 유효한 책임 전가 대상 확인 메소드.
	public boolean isCanSwitch(Long communityId, Long currentMemberId) {

		// ACTIVE 상태의 멤버 리스트 가져오기
		List<CommunityMember> activeMembers = memberRepository.findActiveMembersByCommunityId(communityId);

		// 나를 제외한 사람이 1명 이상 있어야 운영자 권한 이양 가능.
		return activeMembers.stream().anyMatch(m -> !m.getId().equals(currentMemberId));
	}

	
}
