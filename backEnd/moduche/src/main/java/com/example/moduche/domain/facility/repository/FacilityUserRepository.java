package com.example.moduche.domain.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.moduche.domain.facility.FacilityUser;
import com.example.moduche.domain.myPage.dto.MyFacilityDTO;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
@Repository
public interface FacilityUserRepository extends JpaRepository<FacilityUser, Long> {

    /** 시설별 활성 사용자 중 역할 우선순위(OWNER > MANAGER > STAFF)로 정렬해서 반환 */
    @Query("""
        select fu
        from FacilityUser fu
        join fetch fu.user u
        where fu.facility.facilityId = :facilityId
          and (fu.isActive = true or fu.isActive is null)
        order by case fu.roleInFac
                   when 'OWNER' then 0
                   when 'MANAGER' then 1
                   when 'STAFF' then 2
                   else 3
                 end,
                 fu.joinedAt asc,
                 u.name asc
        """)
    List<FacilityUser> findActiveByFacilityOrderByRole(@Param("facilityId") Long facilityId);
    
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
