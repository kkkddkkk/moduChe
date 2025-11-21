package com.example.moduche.domain.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.community.entity.CommunityPostPhoto;

public interface CommunityPostPhotoRepository extends JpaRepository<CommunityPostPhoto, Long> {

	// 작성자: 고은설.
	// 기능: URL로 개별 삭제
	void deleteByPhotoUrl(String photoUrl);

	// 작성자: 고은설.
	// 기능: 특정 게시물 사진 전체 삭제
	void deleteByPost_PostId(Long postId);

	// 작성자: 고은설.
	// 기능: 게시물 기본키 기준 게시물 사진 전체 조회 (수정/삭제 시 필요)
	@Query("SELECT p.photoUrl FROM CommunityPostPhoto p WHERE p.post.postId = :postId ORDER BY p.photoId ASC")
	List<String> findPhotoUrlsByPostId(@Param("postId") Long postId);

	// 작성자: 고은설.
	// 기능: 동아리 기본키 기준 게시물 사진 전체 조회 (동아리 삭제 시 필요)
	@Query("SELECT p.photoUrl FROM CommunityPostPhoto p WHERE p.post.community.communityId = :communityId")
	List<String> findAllKeysByCommunityId(@Param("communityId") Long communityId);

	// 작성자: 고은설.
	// 기능: 동아리 삭제시 관련 게시물 내 사진 삭제.
	@Modifying(clearAutomatically = true)
	@Query("DELETE FROM CommunityPostPhoto ph WHERE ph.post.community.communityId = :communityId")
	void bulkDeleteByCommunityId(@Param("communityId") Long communityId);

}
