package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.community.entity.CommunityMember;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
	
}
