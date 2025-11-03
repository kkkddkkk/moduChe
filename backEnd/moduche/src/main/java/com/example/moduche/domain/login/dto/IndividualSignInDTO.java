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
public class IndividualSignInDTO {
	private String username;
	private String password;
	private String name;
	private String email;
	private String phone;
	
	private String birth;
	private String gender;
	private String disablityGrade;
	private String disabilityType;
	private boolean qualified;
	
}
