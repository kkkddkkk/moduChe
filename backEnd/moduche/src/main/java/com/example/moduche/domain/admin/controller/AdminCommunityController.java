package com.example.moduche.domain.admin.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.admin.dto.AdminCommunityPageResponseDTO;
import com.example.moduche.domain.admin.dto.FetchCommunityDTO;
import com.example.moduche.domain.admin.dto.FetchCommunityDetailDTO;
import com.example.moduche.domain.admin.service.AdminCommunityService;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.community.repository.CommunityRepository;
import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.dto.NoticeDTO;
import com.example.moduche.domain.notice.dto.NoticePageResponseDTO;
import com.example.moduche.domain.notice.repository.NoticeRepository;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;
import com.example.moduche.domain.notice.dto.ModifyNoticeDTO;
import com.example.moduche.domain.notice.service.NoticeService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

	private final AdminCommunityService adminCommunityService;
	private final CommunityRepository communityRepository;

	@GetMapping("/fetchCommunity")
	public Response fetchCommunity(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "status", required = false) String status) {
	    CommunityStatus cs = !status.equals("ALL")?CommunityStatus.valueOf(status):null;
		
		Page<FetchCommunityDTO> communities = adminCommunityService.getCommunities(page, size, keyword, cs);
		
		AdminCommunityPageResponseDTO dto  = AdminCommunityPageResponseDTO.builder()
				.communities(communities.getContent())
	            .totalElements(communityRepository.findCommunityNum())
	            .totalPages(communities.getTotalPages())
	            .currentPage(communities.getNumber() + 1) // 0-based → 1-based
	            .activedElements(communityRepository.findActivedNum())
	            .registeredElements(communityRepository.findRegisteredNum())
	            .build();

		return new Response(StatusEnum.OK, "", dto);
	}

	@GetMapping("/fetchCommunityDetail")
	public Response fetchCommunityDetail(@RequestParam(name = "communityId") Long communityId) {

		FetchCommunityDetailDTO dto = adminCommunityService.getCommunityDetail(communityId);
		return new Response(StatusEnum.OK, "", dto);
	}

	@PutMapping("/modifyCommunityStatus")
	public Response modifyCommunityStatus(@RequestParam(name = "communityId") Long communityId,
			@RequestParam(name = "status") String status) {
		
		adminCommunityService.modifyCommunityStatus(communityId, CommunityStatus.valueOf(status));

		return new Response(StatusEnum.OK, "", null);
	}
//
//	@DeleteMapping("/deleteNotice")
//	public Response deleteNotice(@RequestParam("noticeId") Long noticeId) {
//		noticeService.deleteNotice(noticeId);
//		return new Response(StatusEnum.OK, "삭제 성공", null);
//	}

}
