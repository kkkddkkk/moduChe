package com.example.moduche.domain.login.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.login.Disability;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.login.dto.DisabilityDTO;

@Repository
public interface DisabilityRepository extends JpaRepository<Disability, Long>{

    //김도경: disabilityCode로 Disability 찾기
    @Query("SELECT new com.example.moduche.domain.login.dto.DisabilityDTO"+
    "(d.disabilityId, d.disabilityCode) " +
    "FROM Disability d WHERE LOWER(d.disabilityCode) LIKE LOWER(CONCAT('%', :disabilityCode, '%'))")
     List<DisabilityDTO> findByDisabilityCode(@Param("disabilityCode") String disabilityCode);
}
