package com.example.moduche.domain.notice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.notice.NoticePhoto;

public interface NoticePhotoRepository extends JpaRepository<NoticePhoto, Long> {
	
    @Query("SELECT np.photoUrl FROM NoticePhoto np "+
    		"JOIN np.notice n "+
    		"WHERE n.noticeId = :noticeId")
    List<String> findPhotosByNoticeId(@Param("noticeId") Long noticeId);
    
	// 1) URL로 개별 삭제
	void deleteByPhotoUrl(String photoUrl);
	
	//noticeId로 삭제
	@Modifying
    @Query("DELETE FROM NoticePhoto np WHERE np.notice.noticeId = :noticeId")
    void deleteByNoticeId(@Param("noticeId") Long noticeId);
}
