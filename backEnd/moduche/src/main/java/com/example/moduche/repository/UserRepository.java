package com.example.moduche.repository;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.UserStatus;

import java.time.LocalDateTime;
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
    
 // 관리자 페이지 회원 리스트 전용 (검색, 상태, roleId=3·4 등 모두 처리)
    @Query("""
            SELECT u FROM User u
            WHERE u.role.roleId IN :roleIds
              AND (:statusEnum IS NULL OR u.status = :statusEnum)
              AND (
				    :search IS NULL OR 
				    LOWER(u.username) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) OR
				    LOWER(u.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) OR
				    LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) OR
				    LOWER(FUNCTION('to_char', u.userId, '9999999999'))
				        LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
			        )
            """)
    Page<User> searchMembers(
            @Param("search") String search,
            @Param("statusEnum") UserStatus statusEnum,
            @Param("roleIds") List<Long> roleIds,
            Pageable pageable
    );

    @Query("""
    	    SELECT COUNT(u)
    	    FROM User u
    	    WHERE u.createdAt BETWEEN :start AND :end
    	""")
    	Long countByCreatedAtBetween(
    	        @Param("start") LocalDateTime start,
    	        @Param("end") LocalDateTime end
    	);

}