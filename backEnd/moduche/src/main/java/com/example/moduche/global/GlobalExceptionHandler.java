package com.example.moduche.global;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.moduche.domain.community.service.CommunityPermissionException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	//작성자: 고은설.
	//기능: 보다 디테일하며 세부 조정이 필요한 예외처리, 접근 권한 안내에 대한 "예외" 핸들러.
	
	//동아리 관련 등록.
	@ExceptionHandler(CommunityPermissionException.class)
    public ResponseEntity<?> handlePermissionException(CommunityPermissionException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
    }
}
