package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityAddressDTO {
	private String address; // 8. 기본 주소.
	private String addressDetail; // 9. 상세 주소.
	
}
