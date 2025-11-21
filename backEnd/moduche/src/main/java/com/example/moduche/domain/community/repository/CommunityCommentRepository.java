package com.example.moduche.domain.community.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostComment;
import com.example.moduche.domain.login.User;

public interface CommunityCommentRepository extends JpaRepository<CommunityPostComment, Long> {

	Page<CommunityPostComment> findByPost(CommunityPost post, Pageable pageable);

	Optional<CommunityPostComment> findByCommentIdAndUser(Long commentId, User user);

	//작성자: 고은설.
	//기능: 동아리 삭제에 의한 관련 게시물 내 댓글 전체 삭제.
	@Modifying(clearAutomatically = true)
	@Query("DELETE FROM CommunityPostComment c WHERE c.post.community.communityId = :communityId")
	void bulkDeleteByCommunityId(@Param("communityId") Long communityId);

}
