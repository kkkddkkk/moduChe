package com.example.moduche.domain.main.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.login.dto.DisabilityDTO;
import com.example.moduche.domain.login.dto.EmailTestDTO;
import com.example.moduche.domain.login.dto.FacilitySignInDTO;
import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.IndividualSignInDTO;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.domain.login.service.SignInService;
import com.example.moduche.domain.main.dto.CloseCommunityDTO;
import com.example.moduche.domain.main.dto.CloseFacilityDTO;
import com.example.moduche.domain.main.dto.DistanceDTO;
import com.example.moduche.domain.main.service.DistanceService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main/distance")
public class DistanceController {

	private final DistanceService distanceService;
	@GetMapping("/getList")
	public Response getList(@RequestParam("lat") double lat, @RequestParam("lng") double lng) {
		List<CloseFacilityDTO> facilities = distanceService.fetchCloseFacility(lat, lng);
		List<CloseCommunityDTO> communities = distanceService.fetchCloseCommunity(lat, lng);
		
		DistanceDTO dto = DistanceDTO.builder()
				.facilities(facilities)
				.communities(communities)
				.build();
		
		return new Response(StatusEnum.OK, "fetched", dto);
	}
	
}
