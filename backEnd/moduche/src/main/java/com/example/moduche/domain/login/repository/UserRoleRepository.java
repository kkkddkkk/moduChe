package com.example.moduche.domain.login.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.login.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long>{

}
