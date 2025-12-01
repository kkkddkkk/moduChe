package com.example.moduche.domain.payment.repository;

import com.example.moduche.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = """
        SELECT COALESCE(SUM(p.amount), 0)
        FROM moduche.payment p
        WHERE p.status = :status
    """, nativeQuery = true)
    Long sumTotalPayments(@Param("status") String status);

    @Query(value = """
        SELECT DATE(p.paid_at) AS paid_date,
               COALESCE(SUM(p.amount), 0) AS total_amount
        FROM moduche.payment p
        WHERE p.status = :status
          AND p.paid_at >= :start
        GROUP BY DATE(p.paid_at)
        ORDER BY DATE(p.paid_at)
    """, nativeQuery = true)
    List<Object[]> sumDailyPayments(
            @Param("start") LocalDateTime start,
            @Param("status") String status
    );
}
