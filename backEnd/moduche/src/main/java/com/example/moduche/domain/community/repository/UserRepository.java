package com.example.moduche.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.login.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
}
