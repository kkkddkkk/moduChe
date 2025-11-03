package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {
	
}
