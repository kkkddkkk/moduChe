package com.example.moduche.domain.notice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.notice.NoticePhoto;

public interface NoticePhotoRepository extends JpaRepository<NoticePhoto, Long> {
	
    @Query("SELECT np.photoUrl FROM NoticePhoto np "+
    		"JOIN np.notice n "+
    		"WHERE n.noticeId = :noticeId")
    List<String> findPhotosByNoticeId(@Param("noticeId") Long noticeId);
}
