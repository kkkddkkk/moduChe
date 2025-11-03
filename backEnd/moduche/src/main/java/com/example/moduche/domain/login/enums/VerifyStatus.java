package com.example.moduche.domain.login.enums;

public enum VerifyStatus {
	PENDING,        //초기 상태
    SUCCESS,        // 인증 성공
    EXPIRED,        // 만료됨
    ALREADY_USED,   // 이미 사용됨
    NOT_FOUND,       // 존재하지 않는 코드
    EMAIL_NOT_FOUND // 이메일이 DB에 존재하지 않음
}
