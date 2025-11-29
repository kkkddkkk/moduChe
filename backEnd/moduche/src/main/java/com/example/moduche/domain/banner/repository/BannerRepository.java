package com.example.moduche.domain.banner.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.banner.entity.Banner;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.example.moduche.domain.banner.enums.BannerStatus;

public interface BannerRepository extends JpaRepository<Banner, Long> {

	// 작성자: 고은설.
	// 기능: startDate는 지났고, endDate는 도래하지 않은 유효 배너만 추출하기.
	@Query("""
			    SELECT b FROM Banner b
			    JOIN FETCH b.bannerApply ba
			    LEFT JOIN FETCH ba.bannerPriority bp
			    LEFT JOIN FETCH ba.bannerType bt
			    WHERE b.startDate <= :now
			      AND b.endDate >= :now
			      AND b.status = :bannerStatus
			      AND ba.status = :applyStatus
			      AND bt.label = :bannerType
			""")
	List<Banner> findValidBanners(@Param("now") LocalDateTime now, @Param("bannerStatus") BannerStatus bannerStatus,
			@Param("applyStatus") BannerApplyStatus applyStatus, @Param("bannerType") String bannerType);
}
