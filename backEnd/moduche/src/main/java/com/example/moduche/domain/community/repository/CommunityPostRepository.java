package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.CommunityPost;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
	
}
