package com.example.moduche.repository;

import com.example.moduche.domain.login.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	//김도경: id로 row 찾기
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.status = 'ACTIVE'")
    Optional<User> findByUserName(@Param("username") String username);
    
    //김도경: 이메일로 row 찾기
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.status = 'ACTIVE'")
    Optional<User> findByEmail(@Param("email") String email);
    
	//김도경: id로 name 찾기
    @Query("SELECT u.name FROM User u WHERE u.username = :username AND u.status = 'ACTIVE'")
    Optional<String> findNameByUserName(@Param("username") String username);
    
    
    Page<User> findByRole_RoleIdIn(List<Long> roleIds, Pageable pageable);
}