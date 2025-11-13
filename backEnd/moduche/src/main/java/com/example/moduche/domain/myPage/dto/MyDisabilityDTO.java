package com.example.moduche.domain.myPage.dto;

import com.example.moduche.domain.login.dto.DisabilityDTO;

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
public class MyDisabilityDTO {
	private String username;
	private String phone;
	private String birth;
	private String sex;
	private DisabilityDTO disability;
	private String disabilityGrade;
	private boolean qualified;
	private String note;
}
