package com.example.moduche.domain.facility.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.main.dto.CloseFacilityDTO;
import com.example.moduche.domain.myPage.dto.MyFacilityDTO;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long>{

    //김도경: 전체 row의 시설명, 
    @Query("SELECT new com.example.moduche.domain.facility.dto.FacilityListForSignInDTO"+
    "(f.facilityId, f.facilityName, f.facilityAddress) " +
    "FROM Facility f WHERE LOWER(f.facilityName) LIKE LOWER(CONCAT('%', :name, '%'))")
     List<FacilityListForSignInDTO> findAllNameAndLoca(@Param("name") String name);
    
    //김도경: 가까운 순으로 limit만큼 뽑기
    @Query(value = """
    	    SELECT f.facility_id AS facilityId,
    	           f.facility_name AS facilityName,
    	           f.facility_phone AS facilityPhone,
    	           f.facility_type AS facilityType,
    	           f.open_hours AS openHours,
    	           f.geo_lat AS geoLat,
    	           f.geo_lng AS geoLng,
    	           (6371000 * acos(
    	               cos(radians(:lat)) * cos(radians(f.geo_lat)) *
    	               cos(radians(f.geo_lng) - radians(:lng)) +
    	               sin(radians(:lat)) * sin(radians(f.geo_lat))
    	           )) AS distance
    	    FROM moduche.facility f 
    	    WHERE f.facility_phone IS NOT NULL
    	    ORDER BY distance ASC
    	    LIMIT :limit
    	""", nativeQuery = true)
    	List<CloseFacilityDTO> findNearby(@Param("lat") double lat,
    	                                  @Param("lng") double lng,
    	                                  @Param("limit") int limit);
    

}
