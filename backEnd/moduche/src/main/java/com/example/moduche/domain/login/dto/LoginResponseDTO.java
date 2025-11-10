package com.example.moduche.domain.login.dto;

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
public class LoginResponseDTO {
	private String message;
	private String name;
	private boolean idSuccess;
	private boolean allSuccess;
	private String accessToken;
	private String refreshToken;
}
