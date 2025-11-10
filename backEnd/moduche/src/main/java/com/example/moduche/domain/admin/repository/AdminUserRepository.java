package com.example.moduche.domain.admin.repository;

import com.example.moduche.domain.login.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUserRepository
        extends JpaRepository<User, Long>,
                JpaSpecificationExecutor<User>,
                AdminUserCustomRepository {
}
