package com.example.moduche.domain.course.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EnrollUserProfileResponse {
    private Long userId;
    private String username;
    private String name;
    private String phone;
    private String email;
}
