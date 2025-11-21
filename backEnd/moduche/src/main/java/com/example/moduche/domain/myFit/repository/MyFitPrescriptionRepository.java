package com.example.moduche.domain.myFit.repository;

import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MyFitPrescriptionRepository extends JpaRepository<MyFitPrescription, Long> {
    @Query("SELECT p FROM MyFitPrescription p JOIN p.measureResult mr JOIN mr.measure m JOIN m.user u WHERE u.userId = :userId")
    List<MyFitPrescription> findPrescriptionsByUserId(@Param("userId") Long userId);
}
