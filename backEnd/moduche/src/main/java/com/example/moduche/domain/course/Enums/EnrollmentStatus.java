package com.example.moduche.domain.course.Enums;

public enum EnrollmentStatus {
    REQUESTED,  // 신청만 한 상태 (승인대기)
    APPROVED,   // 시설 유저가 수락
    REJECTED,   // 시설 유저가 거절
    CANCELED    // 신청자가 취소
}
