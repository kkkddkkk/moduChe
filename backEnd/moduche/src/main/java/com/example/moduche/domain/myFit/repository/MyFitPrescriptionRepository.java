package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;

public interface MyFitPrescriptionRepository extends JpaRepository<MyFitPrescription, Long> {
}
