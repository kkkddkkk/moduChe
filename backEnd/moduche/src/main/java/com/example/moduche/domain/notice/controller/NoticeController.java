package com.example.moduche.domain.notice.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.dto.NoticeDTO;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;
import com.example.moduche.domain.notice.service.NoticeService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notice")
public class NoticeController {

	private final NoticeService noticeService;
	
	@GetMapping("/fetchNotice")
	public Response fetchNotice(@RequestParam(name = "page", defaultValue = "0") int page,
	        @RequestParam(name = "size", defaultValue = "10") int size)  {
		
	    Page<FetchNoticeDTO> notices = noticeService.getNotices(page, size);

		return new Response(StatusEnum.OK, "", notices);
	}
	
	@GetMapping("/fetchNoticeDetail")
	public Response fetchNoticeDetail(@RequestParam(name = "noticeId") Long noticeId)  {
		
	    NoticeDTO dto = noticeService.getNoticeDetail(noticeId);

		return new Response(StatusEnum.OK, "", dto);
	}

	@PostMapping("/createNotice")
	public Response createNotice(@RequestPart("data") NoticeDTO dto, 
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		Notice notice = noticeService.createNotice(dto, images);

		return new Response(StatusEnum.OK, "", dto);
	}

}
