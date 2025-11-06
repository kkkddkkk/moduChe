package com.example.moduche.domain.login.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.login.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{

    //김도경: Rolecode로 Role 찾기
    @Query("SELECT r FROM Role r WHERE r.roleCode = :roleCode")
    Optional<Role> findByRoleCode(@Param("roleCode") String roleCode);
}
