package com.example.moduche.domain.community.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.CommunityEnrollment;
import com.example.moduche.domain.community.enums.CommunityEnrollmentStatus;

public interface CommunityEnrollmentRepository extends JpaRepository<CommunityEnrollment, Long>{
	
	//작성자: 고은설.
	//기능: 해당 아이디의 유저가 이 동아리의 회원 신청을 했나요 안 했나요? 반환용.
	boolean existsByUser_UserIdAndCommunity_CommunityId(Long userId, Long communityId);

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
}
