package com.example.moduche.domain.payment.enums;

public enum PaymentStatus {
	PENDING,	//결제 대기중.
	PAID,		//결제됨 (<- 실결제 API 연동 전까지 모든 엔티티 이 상황)
	FAILED,		//결제 실패(프로토타입 단계, 실 서비스시 실패 원인 상태 정의 필여).
	REFUNDED,	//환불됨.
	CANCELED,	//취소됨.
	ETC			//혹시 몰라서 기타.
}
