package com.example.moduche.domain.inquiry.repository;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

	Page<Inquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Inquiry> findByUsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);
}
