package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnrollmentManageDTO {
	//작성자: 고은설.
	//기능: 운영자를 위한 동아리 가입 신청서 조회용.
	private Long enrollmentId;
    private String name;
    private String contact;
    private String introduction;
    private String motivation;
    private LocalDateTime createdAt;
}
