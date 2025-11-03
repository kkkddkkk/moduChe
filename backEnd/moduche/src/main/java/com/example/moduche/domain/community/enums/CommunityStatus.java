package com.example.moduche.domain.community.enums;

public enum CommunityStatus {
	REGISTERED,		//등록 신청됨 -> 관리자 승인 대기.
	ACTIVE,			//관리자 승인, 활동 상태.
	INACTIVE,		//관리자 승인, 비활동 상태.
	BANNED,			//관리자 승인 이후 규정 위반 정지 처리.
	DELETED			//동아리 운영자에 의한 자발적 삭제.
}
