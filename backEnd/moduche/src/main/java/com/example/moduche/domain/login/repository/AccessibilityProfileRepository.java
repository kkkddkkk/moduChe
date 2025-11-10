package com.example.moduche.domain.login.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.login.AccessibilityProfile;

@Repository
public interface AccessibilityProfileRepository extends JpaRepository<AccessibilityProfile, Long>{

}
