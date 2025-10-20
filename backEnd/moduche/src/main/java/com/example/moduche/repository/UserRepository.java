package com.example.moduche.repository;

import com.example.moduche.domain.login.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}