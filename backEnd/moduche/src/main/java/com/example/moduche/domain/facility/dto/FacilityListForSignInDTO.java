package com.example.moduche.domain.facility.dto;

import com.example.moduche.domain.login.dto.IdTestDTO;

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
public class FacilityListForSignInDTO {
	private String name;
	private String loca;
}
