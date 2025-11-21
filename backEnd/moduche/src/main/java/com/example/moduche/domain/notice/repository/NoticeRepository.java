package com.example.moduche.domain.notice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.notice.Notice;
import com.example.moduche.domain.notice.dto.NoticeDTO;
import com.example.moduche.domain.notice.dto.ViewNoticeForAllDTO;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.example.moduche.domain.notice.dto.FetchNoticeDTO;
import com.example.moduche.domain.notice.dto.FetchNoticeForAllDTO;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

	// 김도경: adminPage - noticeList
	@Query("SELECT new com.example.moduche.domain.notice.dto.FetchNoticeDTO("+
			"n.noticeId, n.createdAt, n.updatedAt, n.title, n.isPinned, "+ 
			"n.isVisible, n.viewCount, n.createdByName) " +
			"FROM Notice n WHERE (:keyword IS NULL OR "+ 
			"str(n.noticeId) LIKE CONCAT('%', :keyword, '%') OR " + 
			"n.title LIKE CONCAT('%', :keyword, '%') OR "+ 
			"n.content LIKE CONCAT('%', :keyword, '%')) " + 
			"AND (:isVisible IS NULL OR n.isVisible = :isVisible) "+
			"AND (:isPinned IS NULL OR n.isPinned = :isPinned)")
	Page<FetchNoticeDTO> findFetchNoticeDTOList(Pageable pageable,
			@Param("keyword") String keyword,
	        @Param("isVisible") Boolean isVisible,
	        @Param("isPinned") Boolean isPinned);
	
	@Query("SELECT COUNT(n) FROM Notice n WHERE n.isVisible = true")
	Long findActivatedNum();

	// 김도경: adminPage - noticeDetail
	@Query("SELECT new com.example.moduche.domain.notice.dto.NoticeDTO("
			+ "n.createdByName, n.title, n.content, n.isPinned, n.isVisible) " + "FROM Notice n "
			+ "WHERE n.noticeId = :noticeId")
	Optional<NoticeDTO> findNoticeDetail(@Param("noticeId") Long noticeId);

	// 김도경: adminPage - deleteNotice
	@Modifying
	@Query("DELETE FROM Notice n WHERE n.noticeId = :noticeId")
	void deleteByNoticeId(@Param("noticeId") Long noticeId);
	
	//김도경: noticeForAll - noticeList
	@Query("SELECT new com.example.moduche.domain.notice.dto.FetchNoticeForAllDTO("+
			"n.noticeId, n.title, n.createdAt, n.updatedAt, n.viewCount, "+ 
			"n.createdByName, n.isPinned) " +
			"FROM Notice n WHERE (:keyword IS NULL OR "+ 
			"n.title LIKE CONCAT('%', :keyword, '%') OR "+ 
			"n.content LIKE CONCAT('%', :keyword, '%')) " + 
			"AND (n.isVisible = true) "+
			"ORDER BY n.isPinned DESC, n.createdAt DESC")
	Page<FetchNoticeForAllDTO> findFetchNoticeForAllDTOList(Pageable pageable,
			@Param("keyword") String keyword);
	
	// 김도경: noticeForAll - noticeDetail
	@Query("SELECT new com.example.moduche.domain.notice.dto.ViewNoticeForAllDTO("
			+ "n.noticeId, n.title, n.isPinned, n.createdByName, n.createdAt, n.viewCount, n.content) " +
			"FROM Notice n "
			+ "WHERE n.noticeId = :noticeId")
	Optional<ViewNoticeForAllDTO> findNoticeForAllDetail(@Param("noticeId") Long noticeId);
	
	//이전 글
	@Query("SELECT n.noticeId FROM Notice n WHERE n.createdAt < :createdAt " +
			"AND n.isVisible = true "+
			"ORDER BY n.createdAt DESC")
	List<Long> findPreviousNotice(@Param("createdAt") LocalDateTime createdAt, Pageable pageable);

	// 다음 글
	@Query("SELECT n.noticeId FROM Notice n WHERE n.createdAt > :createdAt "+
			"AND n.isVisible = true "+
			"ORDER BY n.createdAt ASC")
	List<Long> findNextNotice(@Param("createdAt") LocalDateTime createdAt, Pageable pageable);
}

