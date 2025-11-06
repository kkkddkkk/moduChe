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
public class FacilitySignInDTO {
	private String username;
	private String password;
	private Long facilityId;
	private String email;
	private String phone;
	
	private String businessNum;
	private String boss;

}
