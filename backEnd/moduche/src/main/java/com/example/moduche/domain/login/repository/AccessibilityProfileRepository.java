package com.example.moduche.domain.login.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.login.AccessibilityProfile;
import com.example.moduche.domain.myPage.dto.MyDisabilityDTO;

@Repository
public interface AccessibilityProfileRepository extends JpaRepository<AccessibilityProfile, Long>{
	
    //김도경: username 으로 accessibility 객체 찾기
	@Query("SELECT a FROM AccessibilityProfile a " +
			"JOIN a.user u " +
	       	"WHERE u.username = :username")
	Optional<AccessibilityProfile> findByUsername(@Param("username") String username);
	
	//김도경: username 으로 myDisabilityDTO 채우기
	@Query("SELECT new com.example.moduche.domain.myPage.dto.MyDisabilityDTO("+
				"u.username, u.phone, a.birth, a.gender, "+
				"new com.example.moduche.domain.login.dto.DisabilityDTO(d.disabilityId, d.disabilityCode), "+
				"a.disabilityGrade, a.qualified, a.note) " +
				"FROM AccessibilityProfile a " +
				"JOIN a.user u " +
				"JOIN a.disability d " +
		       	"WHERE u.username = :username")
		Optional<MyDisabilityDTO> findMyDisabilityDtoByUsername(@Param("username") String username);
}
