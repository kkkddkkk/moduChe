package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.community.entity.CommunityPost;


@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
	
	// 작성자: 고은설.
	// 기능: 동아리 삭제시 관련 게시물 전부 삭제.
	@Modifying(clearAutomatically = true)
    @Query("DELETE FROM CommunityPost p WHERE p.community.communityId = :communityId")
    void bulkDeleteByCommunityId(@Param("communityId") Long communityId);

}
