package com.example.moduche.domain.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

}
