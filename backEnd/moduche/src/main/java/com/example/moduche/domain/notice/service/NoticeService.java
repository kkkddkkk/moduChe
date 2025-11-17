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

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.NoticePhoto;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;
import com.example.moduche.domain.notice.dto.NoticeDTO;
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
public class NoticeService {

	private final UserRepository userRepository;
	private final NoticeRepository noticeRepository;
	private final NoticePhotoRepository noticePhotoRepository;
	
	private final AWSService awsService;
	
	//공지리스트
	public Page<FetchNoticeDTO> getNotices(int page, int size) {
	    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
	    return noticeRepository.findFetchNoticeDTOList(pageable);
	}
	
	//공지 상세보기
	public NoticeDTO getNoticeDetail(Long noticeId) {
		Optional<NoticeDTO> noticeDTOOp = noticeRepository.findNoticeDetail(noticeId);
		if(noticeDTOOp.isEmpty()) return null;
		NoticeDTO noticeDTO = noticeDTOOp.get();
		noticeDTO.setImgUrls(noticePhotoRepository.findPhotosByNoticeId(noticeId));
		return noticeDTO;
	}
	
	// 공지 올리기
	@Transactional
	public Notice createNotice(NoticeDTO dto, List<MultipartFile> images) {
		User user = userRepository.findByUserName(dto.getUsername())
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + dto.getUsername()));
		
		System.out.println(dto);

		Notice notice = Notice.builder()
				.title(dto.getTitle())
				.content(dto.getContent())
				.isPinned(dto.getIsPinned())
				.isVisible(dto.getIsVisible())
				.createdBy(user)
				.createdByName(user.getName())
				.build();
		noticeRepository.save(notice);
		
		if(images == null) return notice;
		for(MultipartFile file : images) {
			String url = awsService.upload(file, "notice");
			NoticePhoto noticePhoto = NoticePhoto.builder()
					.notice(notice)
					.photoUrl(url)
					.build();
			noticePhotoRepository.save(noticePhoto);
		}
		
		return notice;
		
	}

	
}
