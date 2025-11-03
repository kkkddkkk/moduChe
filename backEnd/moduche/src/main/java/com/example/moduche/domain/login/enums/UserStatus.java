package com.example.moduche.domain.login.enums;

public enum UserStatus {
    PENDING,    // 가입 후 이메일 인증 대기
    ACTIVE,     // 정상 계정
    SUSPENDED,  // 관리자에 의해 정지
    INACTIVE,   // 휴면 계정
    DELETED     // 탈퇴 처리
}
