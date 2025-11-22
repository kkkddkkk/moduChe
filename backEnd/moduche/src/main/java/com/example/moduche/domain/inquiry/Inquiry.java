package com.example.moduche.domain.inquiry;

import com.example.moduche.domain.inquiry.enums.InquiryCategory;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.login.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inquiryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String username; // 작성자 username

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private InquiryCategory category;

    @Column(name = "is_secret")
    private boolean secret;

    @Enumerated(EnumType.STRING)
    private InquiryStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "inquiry", cascade = CascadeType.ALL)
    private InquiryAnswer answer;
}
