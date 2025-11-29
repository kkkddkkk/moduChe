package com.example.moduche.domain.banner.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.banner.DTO.BannerOnPrintCardDTO;
import com.example.moduche.domain.banner.DTO.QBannerOnPrintCardDTO;
import com.example.moduche.domain.banner.entity.QBanner;
import com.example.moduche.domain.banner.entity.QBannerApply;
import com.example.moduche.domain.banner.entity.QBannerDuration;
import com.example.moduche.domain.banner.entity.QBannerPriority;
import com.example.moduche.domain.banner.entity.QBannerType;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BannerRepositoryCustomImpl implements BannerRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<BannerOnPrintCardDTO> findBannerOnList(
            String type, String status, String search, Pageable pageable
    ) {
        QBanner banner = QBanner.banner;
        QBannerApply apply = QBannerApply.bannerApply;
        QBannerType bannerType = QBannerType.bannerType;
        QBannerDuration duration = QBannerDuration.bannerDuration;
        QBannerPriority priority = QBannerPriority.bannerPriority;

        BooleanBuilder builder = new BooleanBuilder();

        // 1) 배너 타입 필터
        if (!type.equalsIgnoreCase("ALL")) {
            builder.and(apply.bannerType.label.eq(type));
        }

        // 2) 배너 출력 상태 필터
        LocalDateTime now = LocalDateTime.now();

        switch (status.toUpperCase()) {
            case "ON":
                builder.and(banner.startDate.loe(now)
                                .and(banner.endDate.goe(now)));
                break;

            case "UPCOMING":
                builder.and(banner.startDate.gt(now));
                break;

            case "EXPIRED":
                builder.and(banner.endDate.lt(now));
                break;
        }

        // 3) 신청자 이름 검색
        if (search != null && !search.isBlank()) {
            builder.and(apply.ownerName.containsIgnoreCase(search));
        }

        List<BannerOnPrintCardDTO> content = queryFactory
                .select(new QBannerOnPrintCardDTO(
                        banner.id,
                        bannerType.label,
                        duration.days,
                        priority.label,
                        apply.imageUrl,
                        apply.redirectUrl,
                        banner.startDate,
                        banner.endDate,
                        apply.ownerName,
                        apply.contact
                ))
                .from(banner)
                .join(banner.bannerApply, apply)
                .leftJoin(apply.bannerType, bannerType)
                .leftJoin(apply.bannerDuration, duration)
                .leftJoin(apply.bannerPriority, priority)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(banner.startDate.desc())
                .fetch();

        Long total = queryFactory
                .select(banner.count())
                .from(banner)
                .join(banner.bannerApply, apply)
                .where(builder)
                .fetchOne();

        return new PageImpl<>(
                content,
                pageable,
                total == null ? 0 : total
        );
    }
}
