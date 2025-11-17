package com.example.moduche.domain.notice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.dto.NoticeDTO;
import com.example.moduche.domain.notice.dto.FetchNoticeDTO;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
	
	//김도경: adminPage - noticeList
    @Query("SELECT new com.example.moduche.domain.notice.dto.FetchNoticeDTO("+
			"n.noticeId, n.createdAt, n.updatedAt, n.title, n.isPinned, "+
    		"n.isVisible, n.viewCount, n.createdByName) "+
    		"FROM Notice n")
    Page<FetchNoticeDTO> findFetchNoticeDTOList(Pageable pageable);
    
	//김도경: adminPage - noticeDetail
    @Query("SELECT new com.example.moduche.domain.notice.dto.NoticeDTO("+
			"n.createdByName, n.title, n.content, n.isPinned, n.isVisible) "+
    		"FROM Notice n "+
    		"WHERE n.noticeId = :noticeId")
    Optional<NoticeDTO> findNoticeDetail(@Param("noticeId") Long noticeId);
}
