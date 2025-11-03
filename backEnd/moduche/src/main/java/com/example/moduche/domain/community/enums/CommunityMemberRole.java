package com.example.moduche.domain.community.enums;

public enum CommunityMemberRole {
	ADMIN,		//최초 등록자 => 자동 오우너 등록, 전권한.
	MANAGER,	//일반 관리자 (동아리 존망을 흔드는 행위_예: 동아리 삭제, 이외 가능).
	MEMBER		//일반 소속 회원(동아리 게시판만 이용 가능).
}
