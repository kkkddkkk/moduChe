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
import com.example.moduche.domain.myPage.dto.MyFacilityDTO;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long>{

    //김도경: 전체 row의 시설명, 
    @Query("SELECT new com.example.moduche.domain.facility.dto.FacilityListForSignInDTO"+
    "(f.facilityId, f.facilityName, f.facilityAddress) " +
    "FROM Facility f WHERE LOWER(f.facilityName) LIKE LOWER(CONCAT('%', :name, '%'))")
     List<FacilityListForSignInDTO> findAllNameAndLoca(@Param("name") String name);
    

}
