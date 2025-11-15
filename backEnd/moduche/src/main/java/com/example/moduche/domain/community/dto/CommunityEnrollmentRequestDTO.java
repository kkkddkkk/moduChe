package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommunityEnrollmentRequestDTO {
    private String name;
    private String contact;
    private String introduction;
    private String motivation;
    private LocalDateTime createdAt;
}
