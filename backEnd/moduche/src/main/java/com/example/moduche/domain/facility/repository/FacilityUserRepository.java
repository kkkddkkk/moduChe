package com.example.moduche.domain.facility.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.facility.FacilityUser;
import com.example.moduche.domain.myPage.dto.MyFacilityDTO;

@Repository
public interface FacilityUserRepository extends JpaRepository<FacilityUser, Long> {

//	private String username;
//	private String roleInFac;
//	private String phone;
//	private String facilityType;
//	private String facilityAddress;
//	private String openHours;
//	private String businessNum;
//	private String boss;
//	private String accessibilityFeatures;
	// 김도경: username으로 myFacilityDTO 만들기
	@Query("SELECT new com.example.moduche.domain.myPage.dto.MyFacilityDTO"+
			"(u.username, fu.roleInFac, u.phone, f.facilityType, f.facilityAddress, f.geoLat, f.geoLng, "+
			"f.openHours, f.business_num, f.boss, f.accessibilityFeatures) "+
			"FROM FacilityUser fu " + 
			"JOIN fu.user u " + 
			"JOIN fu.facility f " + 
			"WHERE u.username = :username")
	Optional<MyFacilityDTO> findMyFacilityDtoByUserName(@Param("username") String username);
	
	//김도경: username으로 FacilityUser 찾기
	@Query("SELECT fu FROM FacilityUser fu JOIN fu.user u WHERE u.username = :username")
	Optional<FacilityUser> findByUsername(@Param("username") String username);
	
}
