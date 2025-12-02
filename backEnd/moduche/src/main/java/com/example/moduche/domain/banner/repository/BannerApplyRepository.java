package com.example.moduche.domain.banner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.banner.entity.BannerApply;

public interface BannerApplyRepository extends JpaRepository<BannerApply, Long> {

	//작성자: 고은설.
	//기능: 배치 메소드가 호출할 노출수 업데이트 함수.
	@Modifying
    @Query("UPDATE BannerApply b SET b.exposureCount = COALESCE(b.exposureCount, 0) + :count WHERE b.id = :id")
    void increaseExposureCount(@Param("id") Long id, @Param("count") Integer count);
	
	List<BannerApply> findByApplicant_UserId(Long userId);
    
    List<BannerApply> findByContactAndPassword(String contact, String guestPassword);


}
