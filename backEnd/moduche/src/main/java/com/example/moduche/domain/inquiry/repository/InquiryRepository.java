package com.example.moduche.domain.inquiry.repository;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.login.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Page<Inquiry> findByUser(User user, Pageable pageable);

    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);

    boolean existsByInquiryId(Long id);
}
