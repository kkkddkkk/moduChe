package com.example.moduche.domain.facility.enums;

public enum FacilityStatus {
    ACTIVE,         // 정상 영업 중인 사업자
    CLOSED,           // 폐업 처리된 사업자
    SUSPENDED,        // 휴업 상태
    INVALID,      // 등록말소(허위 등록 등)
    UNKNOWN;        // 국세청 응답 불가 또는 미등록 사업자
}
