package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.CommunityPostPhoto;

public interface CommunityPostPhotoRepository extends JpaRepository<CommunityPostPhoto, Long> {
	
}
