package com.example.moduche.domain.community.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityRequestDTO;
import com.example.moduche.domain.community.service.CommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommunityController {

	private final CommunityService communityService;
	
//	@PostMapping("/api/community")
//	public ResponseEntity<?> registerCommunity(
//			@ModelAttribute CommunityRequestDTO dto,
//			@RequestPart("representativeImage") MultipartFile repImg, 
//			@RequestPart("images") List<MultipartFile> images,
//			@AuthenticationPrincipal UserDetails user) {
//		
//		communityService.registerCommunity(dto, repImg, images, user);
//		return ResponseEntity.ok("등록 완료");
//	}
	
	@PostMapping("/api/community")
	public ResponseEntity<?> registerCommunity(
	    @RequestPart("data") CommunityRequestDTO dto,
	    @RequestPart("representativeImage") MultipartFile repImg,
	    @RequestPart("images") List<MultipartFile> images
	) {
	    System.out.println("content = " + dto.getContent());
	    communityService.registerCommunity(dto, repImg, images);
	    return ResponseEntity.ok("등록 완료");
	}
}
