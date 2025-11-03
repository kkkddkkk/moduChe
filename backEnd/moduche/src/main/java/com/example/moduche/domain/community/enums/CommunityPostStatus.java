package com.example.moduche.domain.community.enums;

public enum CommunityPostStatus {

	REGISTERED,		//등록됨 -> 관리자 승인 대기.
	PUBLISHED,		//게시됨 -> 관리자 승인.
	REJECTED,		//반려됨 -> 관리자 미승인.
	DELETED,		//삭제됨 -> 작성자에 의해 삭제.
}
