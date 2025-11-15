package com.example.moduche.domain.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.community.entity.CommunityPostPhoto;

public interface CommunityPostPhotoRepository extends JpaRepository<CommunityPostPhoto, Long> {
	// 1) URL로 개별 삭제
	void deleteByPhotoUrl(String photoUrl);

	// 2) 특정 게시물 사진 전체 삭제
	void deleteByPost_PostId(Long postId);

	// 3) 게시물 사진 전체 조회 (수정/삭제 시 필요)
	@Query("SELECT p.photoUrl FROM CommunityPostPhoto p WHERE p.post.postId = :postId ORDER BY p.photoId ASC")
	List<String> findPhotoUrlsByPostId(@Param("postId") Long postId);
}
