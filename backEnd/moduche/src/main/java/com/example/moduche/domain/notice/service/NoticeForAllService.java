package com.example.moduche.domain.notice.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.entity.CommunityPostPhoto;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.NoticePhoto;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;
import com.example.moduche.domain.notice.dto.FetchNoticeForAllDTO;
import com.example.moduche.domain.notice.dto.ModifyNoticeDTO;
import com.example.moduche.domain.notice.dto.NoticeDTO;
import com.example.moduche.domain.notice.dto.NoticePageResponseDTO;
import com.example.moduche.domain.notice.dto.ViewNoticeForAllDTO;
import com.example.moduche.domain.notice.repository.NoticePhotoRepository;
import com.example.moduche.domain.notice.repository.NoticeRepository;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class NoticeForAllService {

	private final NoticeRepository noticeRepository;
	private final NoticePhotoRepository noticePhotoRepository;
	
	private final AWSService awsService;
	
	//공지리스트
	public Page<FetchNoticeForAllDTO> getNotices(int page, int size, String keyword) {
	    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
	    return noticeRepository.findFetchNoticeForAllDTOList(pageable, keyword);
	}
	
	//공지 상세보기
	public ViewNoticeForAllDTO getNoticeDetail(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId).orElseThrow();
		notice.setViewCount(notice.getViewCount()+1);
		
		Optional<ViewNoticeForAllDTO> noticeDTOOp = noticeRepository.findNoticeForAllDetail(noticeId);
		if(noticeDTOOp.isEmpty()) return null;
		ViewNoticeForAllDTO dto = noticeDTOOp.get();
		List<String> keys = noticePhotoRepository.findPhotosByNoticeId(noticeId);
		List<String> urls = keys.stream().map(k -> awsService.toPreSignedUrl(k, Duration.ofMinutes(20))).toList();
		dto.setImgUrls(urls);
		
		List<Long> prev = noticeRepository.findPreviousNotice(dto.getCreatedAt(), PageRequest.of(0, 1));
		List<Long> next = noticeRepository.findNextNotice(dto.getCreatedAt(), PageRequest.of(0, 1));
		dto.setPrevId(prev.size()>0?prev.get(0):null);
		dto.setNextId(next.size()>0?next.get(0):null);
	
		
		return dto;
	}
	
}
