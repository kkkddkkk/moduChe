package com.example.moduche.domain.community.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostComment;
import com.example.moduche.domain.login.User;

public interface CommunityCommentRepository extends JpaRepository<CommunityPostComment, Long> {
	
	Page<CommunityPostComment> findByPost(CommunityPost post, Pageable pageable);

	Optional<CommunityPostComment> findByCommentIdAndUser(Long commentId, User user);
}
