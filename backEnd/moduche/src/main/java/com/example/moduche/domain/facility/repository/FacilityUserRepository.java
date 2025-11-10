package com.example.moduche.domain.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.facility.FacilityUser;
@Repository
public interface FacilityUserRepository extends JpaRepository<FacilityUser, Long>{

}
