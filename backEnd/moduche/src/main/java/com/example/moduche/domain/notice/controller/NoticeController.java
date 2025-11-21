package com.example.moduche.domain.notice.controller;

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
@RequestMapping("/api/notice")
public class NoticeController {

	private final NoticeService noticeService;
	private final NoticeRepository noticeRepository;

	@GetMapping("/fetchNotice")
	public Response fetchNotice(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "isVisible", required = false) Boolean isVisible,
			@RequestParam(name = "isPinned", required = false) Boolean isPinned) {

		Page<FetchNoticeDTO> notices = noticeService.getNotices(page, size, keyword, isVisible, isPinned);
	    NoticePageResponseDTO dto = NoticePageResponseDTO.builder()
	            .notices(notices.getContent())
	            .totalElements(notices.getTotalElements())
	            .totalPages(notices.getTotalPages())
	            .currentPage(notices.getNumber() + 1) // 0-based → 1-based
	            .activatedElements(noticeRepository.findActivatedNum())
	            .build();

		return new Response(StatusEnum.OK, "", dto);
	}

	@GetMapping("/fetchNoticeDetail")
	public Response fetchNoticeDetail(@RequestParam(name = "noticeId") Long noticeId) {

		NoticeDTO dto = noticeService.getNoticeDetail(noticeId);
		System.out.println(dto);
		return new Response(StatusEnum.OK, "", dto);
	}

	@PostMapping("/createNotice")
	public Response createNotice(@RequestPart("data") NoticeDTO dto,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		Notice notice = noticeService.createNotice(dto, images);

		return new Response(StatusEnum.OK, "", dto);
	}

	@PutMapping("/modifyNotice")
	public Response modifyNotice(@RequestPart("data") ModifyNoticeDTO dto,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		Notice notice = noticeService.modifyNotice(dto, images);

		return new Response(StatusEnum.OK, "", dto);
	}

	@DeleteMapping("/deleteNotice")
	public Response deleteNotice(@RequestParam("noticeId") Long noticeId) {
		noticeService.deleteNotice(noticeId);
		return new Response(StatusEnum.OK, "삭제 성공", null);
	}

}
