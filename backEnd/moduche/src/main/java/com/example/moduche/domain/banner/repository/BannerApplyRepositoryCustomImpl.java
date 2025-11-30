package com.example.moduche.domain.banner.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.banner.DTO.BannerApplyCardDTO;
import com.example.moduche.domain.banner.DTO.QBannerApplyCardDTO;
import com.example.moduche.domain.banner.entity.BannerApply;
import com.example.moduche.domain.banner.entity.QBannerApply;
import com.example.moduche.domain.banner.entity.QBannerDuration;
import com.example.moduche.domain.banner.entity.QBannerPriority;
import com.example.moduche.domain.banner.entity.QBannerType;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.example.moduche.domain.payment.entity.QPayment;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BannerApplyRepositoryCustomImpl implements BannerApplyRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<BannerApplyCardDTO> findCardsByStatus(BannerApplyStatus status, String search, String bannerType, Pageable pageable) {

		QBannerApply apply = QBannerApply.bannerApply;
		
		 
		List<BannerApply> debug = queryFactory
		        .select(apply)
		        .from(apply)
		        .fetch();
		
		QBannerType type = QBannerType.bannerType;
		QBannerDuration duration = QBannerDuration.bannerDuration;
		QBannerPriority priority = QBannerPriority.bannerPriority;
		QPayment payment = QPayment.payment;

		BooleanBuilder builder = new BooleanBuilder();
		builder.and(apply.status.eq(status));

		//검색 조건.
		if (search != null && !search.isBlank()) {
		    builder.and(
		        apply.ownerName.containsIgnoreCase(search)
		            .or(apply.contact.containsIgnoreCase(search))
		    );
		}

		//배너 타입 필터.
		if (bannerType != null && !bannerType.equalsIgnoreCase("ALL")) {
		    builder.and(apply.bannerType.label.eq(bannerType));
		}

		List<BannerApplyCardDTO> content = queryFactory
				.select(new QBannerApplyCardDTO(apply.id, type.label, duration.days, priority.label, apply.imageUrl,
						apply.redirectUrl, apply.status, apply.appliedAt, payment.id, payment.amount, apply.ownerName,
						apply.contact))
				.from(apply).leftJoin(apply.bannerType, type).leftJoin(apply.bannerDuration, duration)
				.leftJoin(apply.bannerPriority, priority).leftJoin(apply.payment, payment).where(builder)
				.offset(pageable.getOffset()).limit(pageable.getPageSize()).orderBy(apply.appliedAt.desc()).fetch();

		
		Long total = queryFactory.select(apply.count()).from(apply).where(builder).fetchOne();

		return new PageImpl<>(content, pageable, total == null ? 0 : total);
	}
}
