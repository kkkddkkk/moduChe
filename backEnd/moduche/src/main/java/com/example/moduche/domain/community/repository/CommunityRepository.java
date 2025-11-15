package com.example.moduche.domain.community.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {
	
	//동아리 소유주 여부 경량 반환, 작성자: 고은설.
    boolean existsByOwner_UserId(Long userId);
    
    //동아리 아이디, 유저 아이디 두개로 해당 유저가 해당 동아리 소유주인지 반환, 작성자: 고은설.
    boolean existsByCommunityIdAndOwner_UserId(Long communityId, Long ownerId);
    
    //운영자 아이디에 해당되는 소유 동아리 정보 반환, 작성자: 고은설.
    //단건.
    //Optional<Community> findByCommunityId(Long communityId);
    //목록.
    List<Community> findByOwner_UserId(Long ownerId);
	
}
