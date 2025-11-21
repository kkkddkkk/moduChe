package com.example.moduche.domain.community.service;

public class CommunityPermissionException extends RuntimeException{
	
	//작성자: 고은설.
	//기능: 동아리 관련 각종 접근 거부에 대한 커스텀 예외 핸들러.
    public CommunityPermissionException(String message) {
        super(message);
    }
}
