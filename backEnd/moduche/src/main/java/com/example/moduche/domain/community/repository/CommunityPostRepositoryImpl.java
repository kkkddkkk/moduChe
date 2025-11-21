package com.example.moduche.domain.community.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;
import com.example.moduche.domain.community.dto.PostManageDTO;
import com.example.moduche.domain.community.entity.QCommunity;
import com.example.moduche.domain.community.entity.QCommunityMember;
import com.example.moduche.domain.community.entity.QCommunityPost;
import com.example.moduche.domain.community.entity.QCommunityPostPhoto;
import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.global.AWS.service.AWSService;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

import static com.example.moduche.domain.community.entity.QCommunity.community;
import static com.example.moduche.domain.promotion.QPromotion.promotion;
import static com.example.moduche.domain.community.entity.QCommunityPost.communityPost;
import static com.example.moduche.domain.community.entity.QCommunityPostPhoto.communityPostPhoto;
import static com.example.moduche.domain.community.entity.QCommunityPostComment.communityPostComment;
import static com.example.moduche.domain.login.QUser.user;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.JPAExpressions;

@Repository
@RequiredArgsConstructor
public class CommunityPostRepositoryImpl implements CommunityPostRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final AWSService awsService;

	// 작성자: 고은설.
	// 기능: 회원수, 프로모션 여부 포함한 동아리 게시글 목록 조회용 메서드.
	@Override
	public Page<CommunityListResponseDTO> findCommunityPostSummaries(Pageable pageable) {
		LocalDateTime now = LocalDateTime.now();

		// HTML 태그 제거 후 앞 20자만 추출.
		StringTemplate shortDesc = Expressions.stringTemplate(
				"function('substring', function('regexp_replace', {0}, '<[^>]+>', '', 'g'), 1, 20)",
				communityPost.title);

		// 커뮤니티 대표 이미지 서브쿼리 (게시물 PK 오름차순 → 첫 이미지)
		QCommunityPost cp2 = new QCommunityPost("cp2");
		QCommunityPostPhoto photo2 = new QCommunityPostPhoto("photo2");

		QCommunity community = QCommunity.community;
		QCommunityPost cp = QCommunityPost.communityPost;
		QCommunityPostPhoto cpp = QCommunityPostPhoto.communityPostPhoto;

		StringTemplate representativeImageSubquery = Expressions.stringTemplate(
				"(SELECT cpp.photoUrl " + "FROM CommunityPost cp " + "JOIN CommunityPostPhoto cpp ON cpp.post = cp "
						+ "WHERE cp.community.communityId = {0} " + "ORDER BY cp.postId ASC LIMIT 1)",
				community.communityId);

		// 프로모션 여부 CASE 구문.
		BooleanExpression isPromotedExpr = new CaseBuilder().when(promotion.promotionId.isNotNull()).then(true)
				.otherwise(false);

		// 커뮤니티별 회원 수 서브쿼리
		var cmSub = new QCommunityMember("cmSub");

		// 게시물 상태가 'REGISTERED'인 게시물만 가져오기 (삭제된 게시물 제외)
		List<CommunityListResponseDTO> results = queryFactory
				.select(Projections.constructor(CommunityListResponseDTO.class, community.communityId, cp.postId,
						community.name, shortDesc, representativeImageSubquery, community.createdAt,
						JPAExpressions.select(cmSub.countDistinct()).from(cmSub).where(cmSub.community.eq(community)),
						isPromotedExpr))
				.from(community).leftJoin(communityPost).on(communityPost.community.eq(community))
				.where(communityPost.status.eq(CommunityPostStatus.REGISTERED)) // 삭제된 게시물 제외
				.leftJoin(promotion)
				.on(promotion.post.eq(communityPost).and(promotion.startDate.loe(now)).and(promotion.endDate.goe(now)))
				.orderBy(isPromotedExpr.desc(), communityPost.createdAt.desc()).offset(pageable.getOffset())
				.limit(pageable.getPageSize()).fetch();

		// presigned URL 변환
		List<CommunityListResponseDTO> convertedResults = results.stream().peek(dto -> {
			String key = dto.getRepresentativeImage();
			if (key != null && !key.isBlank()) {
				dto.setRepresentativeImage(awsService.toPreSignedUrl(key, Duration.ofMinutes(20)));
			}
		}).toList();

		// 전체 게시글 수 조회
		Long totalCount = queryFactory.select(communityPost.count()).from(communityPost).fetchOne();

		return new PageImpl<>(convertedResults, pageable, totalCount);
	}

	@Override
	public CommunityPostDetailDTO findPostDetail(Long postId, boolean issuePreSignedUrls) {
		var cmSub = new com.example.moduche.domain.community.entity.QCommunityMember("cmSub");

		// 메인 블럭 조회.
		CommunityPostDetailDTO dto = queryFactory
				.select(Projections.constructor(CommunityPostDetailDTO.class, community.communityId, community.name,
						community.maxMember,
						JPAExpressions.select(cmSub.countDistinct()).from(cmSub).where(cmSub.community.eq(community)),
						community.founder, community.purpose, community.createdAt, promotion.promotionId.isNotNull(),
						community.scheduleType, community.scheduleDetail, community.address, community.addressDetail,
						// postImages는 후속 조회로 채움.
						// title, content, hashTags는 아래 세 필드로 채움.
						communityPost.title, communityPost.content, communityPost.hashTags))
				.from(communityPost).join(community).on(communityPost.community.eq(community)).leftJoin(promotion)
				.on(promotion.post.eq(communityPost)).where(communityPost.postId.eq(postId)).fetchOne();

		if (dto == null) {
			return null;
		}

		// 사진 키 조회.
		List<String> keys = findPhotoKeysByPostId(postId);

		// Pre-Signed URL 발급 여부에 따라 분기.
		if (issuePreSignedUrls) {
			List<String> urls = keys.stream().map(k -> awsService.toPreSignedUrl(k, Duration.ofMinutes(20))).toList();
			dto.setPostImages(urls);
		} else {
			dto.setPostImages(keys);
		}

		return dto;
	}

	// 사진 키 목록 조회.
	@Override
	public List<String> findPhotoKeysByPostId(Long postId) {
		return queryFactory.select(communityPostPhoto.photoUrl).from(communityPostPhoto)
				.where(communityPostPhoto.post.postId.eq(postId)).orderBy(communityPostPhoto.photoId.asc()).fetch();
	}

	@Override
	public Page<CommunityPostCommentDTO> findCommentsByPost(Long postId, Pageable pageable) {
		List<CommunityPostCommentDTO> items = queryFactory
				.select(Projections.constructor(CommunityPostCommentDTO.class, communityPostComment.commentId,
						user.name, user.userId, communityPostComment.content, communityPostComment.createdAt))
				.from(communityPostComment).join(communityPostComment.user, user)
				.where(communityPostComment.post.postId.eq(postId)).orderBy(communityPostComment.createdAt.desc())
				.offset(pageable.getOffset()).limit(pageable.getPageSize()).fetch();

		Long total = queryFactory.select(communityPostComment.count()).from(communityPostComment)
				.where(communityPostComment.post.postId.eq(postId)).fetchOne();

		return new PageImpl<>(items, pageable, total == null ? 0 : total);
	}

	public Page<PostManageDTO> findAllCommunityPosts(Long communityId, Pageable pageable) {

		QCommunityPostPhoto cpp = QCommunityPostPhoto.communityPostPhoto;

		List<PostManageDTO> items = queryFactory.select(Projections.constructor(PostManageDTO.class,
				communityPost.postId, communityPost.title, communityPost.content, communityPost.hashTags,
				communityPost.status, communityPost.createdAt, cpp.photoUrl.min() // 대표 이미지.
		)).from(communityPost).leftJoin(cpp).on(cpp.post.postId.eq(communityPost.postId))
				.where(communityPost.community.communityId.eq(communityId))
				.groupBy(communityPost.postId, communityPost.title, communityPost.content, communityPost.hashTags,
						communityPost.status, communityPost.createdAt)
				.orderBy(communityPost.createdAt.desc()).offset(pageable.getOffset()).limit(pageable.getPageSize())
				.fetch();

		Long total = queryFactory.select(communityPost.count()).from(communityPost)
				.where(communityPost.community.communityId.eq(communityId)).fetchOne();

		return new PageImpl<>(items, pageable, total);
	};

	@Override
	public void deleteCommentsByPostId(Long postId) {

		queryFactory.delete(communityPostComment).where(communityPostComment.post.postId.eq(postId)).execute();

	}
}
