package com.example.moduche.domain.main.dto;

import java.util.List;

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
public class DistanceDTO {
	private List<CloseFacilityDTO> facilities;
	private List<CloseCommunityDTO> communities;
}
