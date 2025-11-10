package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.community.entity.CommunityPost;


@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
	

}
