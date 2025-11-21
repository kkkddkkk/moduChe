package com.example.moduche.domain.banner.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerApplyRequestDTO {
    private Long bannerTypeId;
    private Long bannerDurationId;
    private Long bannerPriorityId;
    
    private Long paymentId;

    private String ownerName;   // 회원이면: 로그인 유저 이름과 동일하게 세팅 가능, 비회원이면 폼 입력값
    private String contact;     // 전화번호 or 이메일
    private boolean memberApply; // true = 회원 신청, false = 비회원 신청
    private String guestPassword; // 비회원일 때만 사용(회원 신청일 경우 null/빈 문자열 허용)
    private String applicantLoginId; // 회원일 때만 사용(비회원 신청일 경우 null/빈 문자열 허용)

    private String redirectUrl; // 클릭 시 이동 URL
}
