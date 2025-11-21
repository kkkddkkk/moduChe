package com.example.moduche.domain.community.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.community.dto.MemberManageDTO;
import com.example.moduche.domain.community.dto.MyCommunityManageDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {

	// 작성자: 고은설.
	// 기능: 해당 유저가 이미 이 동아리 회원인가요 아닌가요? 반환용.
	boolean existsByUser_UserIdAndCommunity_CommunityId(Long userId, Long communityId);

	// 작성자: 고은설.
	// 기능: 해당 유저가 이 동아리의 "활동" 회원 여부 조회용.
	boolean existsByUser_UserIdAndCommunity_CommunityIdAndStatusIn(Long userId, Long communityId,
			Collection<CommunityMemberStatus> statuses);

	boolean existsByUser_UserIdAndCommunity_CommunityIdAndStatus(Long userId, Long communityId,
			CommunityMemberStatus status);

	// 작성자: 고은설.
	// 기능: 해당 유저가 소속된 동아리가 하나라도 있는지 경량 반환용(활동, 정지만 필터링).
	boolean existsByUser_UserIdAndStatusIn(Long userId, List<CommunityMemberStatus> statuses);

	// 작성자: 고은설.
	// 기능: 동아리 소속 회원 전체 뽑아오기 용.
	Page<CommunityMember> findByCommunity_CommunityId(Long communityId, Pageable pageable);

	// 작성자: 고은설.
	// 기능: 동아리 소속 회원 "상태별로" 뽑아오기 용.
	Page<CommunityMember> findByCommunity_CommunityIdAndStatus(Long communityId, CommunityMemberStatus status,
			Pageable pageable);

	// 작성자: 고은설.
	// 기능: 해당 멤버 유저가 해당 동아리 멤버인 경우 동아리 회원 정보 반환용 (기준 CommunityMember의 Id).
	Optional<CommunityMember> findByIdAndCommunity_CommunityId(Long memberId, Long communityId);

	// 작성자: 고은설.
	// 기능: 해당 일반 유저가 해당 동아리 멤버인 경우 동아리 회원 정보 반환용 (기준 User의 Id).
	Optional<CommunityMember> findByCommunity_CommunityIdAndUser_UserId(Long communityId, Long userId);

	// 작성자: 고은설.
	// 기능: 동아리 소속 회원 정보 프로젝션 후 바로 페이지로 리턴.
	@Query(value = """
			select new com.example.moduche.domain.community.dto.MemberManageDTO(
			    m.id,
			    u.name,
			    m.role,
			    m.status,
			    m.joinedAt,
			    m.suspendedAt,
			    m.suspendedAt,
			    m.suspendReason,
			    m.quitReason
			)
			from CommunityMember m
			join m.user u
			where m.community.communityId = :communityId
			  and m.status = :status
			""", countQuery = """
			select count(m)
			from CommunityMember m
			where m.community.communityId = :communityId
			  and m.status = :status
			""")
	Page<MemberManageDTO> findMemberDTOs(@Param("communityId") Long communityId,
			@Param("status") CommunityMemberStatus status, Pageable pageable);

	@Query(value = """
			SELECT new com.example.moduche.domain.community.dto.MyCommunityManageDTO(
			    c.communityId,
			    c.name,
			    c.founder,
			    cm.joinedAt,
			    cm.quitAt,
			    c.createdAt,
			    cm.role,
			    cm.status
			)
			FROM CommunityMember cm
			JOIN cm.community c
			WHERE cm.user.userId = :userId
			  AND cm.status IN :statuses
			  AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
			ORDER BY cm.joinedAt DESC
			""", countQuery = """
			SELECT COUNT(cm)
			FROM CommunityMember cm
			JOIN cm.community c
			WHERE cm.user.userId = :userId
			  AND cm.status IN :statuses
			  AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
			""")
	Page<MyCommunityManageDTO> findMyCommunityAsMember(@Param("userId") Long userId,
			@Param("statuses") List<CommunityMemberStatus> statuses, @Param("search") String search, Pageable pageable);

	// 작성자: 고은설.
	// 기능: 활동상태의 동아리 회원 조회용(다음 운영자 대상 찾기용).
	@Query("""
			select m
			from CommunityMember m
			where m.community.communityId = :communityId
			  and m.status = 'ACTIVE'
			""")
	List<CommunityMember> findActiveMembersByCommunityId(Long communityId);

	// 작성자: 고은설.
	// 기능: 동아리 잔존 회원수 간편 조회.
	long countByCommunityAndStatusNot(Community community, CommunityMemberStatus status);

	// 작성자: 고은설.
	// 기능: 동아리 삭제 시 가입 회원 삭제.
	@Modifying(clearAutomatically = true)
	@Query("DELETE FROM CommunityMember m WHERE m.community.communityId = :communityId")
	void bulkDeleteByCommunityId(@Param("communityId") Long communityId);

}
