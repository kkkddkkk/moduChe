package com.example.moduche.domain.community.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.community.entity.CommunityEnrollment;
import com.example.moduche.domain.community.enums.CommunityEnrollmentStatus;

public interface CommunityEnrollmentRepository extends JpaRepository<CommunityEnrollment, Long>{
	
	//작성자: 고은설.
	//기능: 해당 아이디의 유저가 이 동아리의 회원 신청을 했나요 안 했나요? 반환용.
	boolean existsByUser_UserIdAndCommunity_CommunityId(Long userId, Long communityId);
	
	//작성자: 고은설.
	//기능: 동호회, 회원 userId제공 시 communityEnrollment 엔티티 반환.
	Optional<CommunityEnrollment> findByCommunity_CommunityIdAndUser_UserId(Long communityId, Long userId);


	//작성자: 고은설.
	//기능: 동아리 회원 신청 내역 상태에 따라 쏙쏙 뽑아오기용.
	//리스크 버전.
    //List<CommunityEnrollment> findByCommunity_CommunityIdAndStatus(Long communityId, CommunityEnrollmentStatus status);
	//페이지 버전.
    Page<CommunityEnrollment> findByCommunity_CommunityIdAndStatus(
            Long communityId,
            CommunityEnrollmentStatus status,
            Pageable pageable
    );
    
    
    //작성자: 고은설.
    //기능: 동아리 삭제시 연관 신청 엔티티 삭제.
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM CommunityEnrollment r WHERE r.community.communityId = :communityId")
    void bulkDeleteByCommunityId(@Param("communityId") Long communityId);
}
