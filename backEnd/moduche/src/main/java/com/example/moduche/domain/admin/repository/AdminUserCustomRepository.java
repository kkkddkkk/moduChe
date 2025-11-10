package com.example.moduche.domain.admin.repository;

import com.example.moduche.domain.login.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface AdminUserCustomRepository {
    Page<User> findAdmins(String q, String status, LocalDateTime createdFrom, LocalDateTime createdTo, Pageable pageable);
}
