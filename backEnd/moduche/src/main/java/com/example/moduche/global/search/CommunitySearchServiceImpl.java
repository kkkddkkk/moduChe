package com.example.moduche.global.search;

import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostPhoto;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.AWS.service.AWSService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunitySearchServiceImpl implements CommunitySearchService {

    private final EntityManager em;
    private final AWSService awsService;  // ⬅️ 이미지 URL 변환 위해 필요

    @Override
    public SearchResponse<CommunitySearchResultDto> search(SearchRequest req) {

        int page = Math.max(0, req.getPage());
        int size = req.getSize() > 0 ? req.getSize() : 20;

        CriteriaBuilder cb = em.getCriteriaBuilder();

        /* ============= 1단계: Community 기본 정보 조회 ============= */
        CriteriaQuery<CommunitySearchResultDto> cq =
                cb.createQuery(CommunitySearchResultDto.class);

        Root<Community> community = cq.from(Community.class);
        Join<Community, User> owner = community.join("owner", JoinType.LEFT);

        List<Predicate> predicates =
                buildPredicates(cb, cq, community, owner, req);

        // representativeImage는 일단 null로 두고 생성
        cq.select(cb.construct(
                        CommunitySearchResultDto.class,
                        community.get("communityId"),
                        community.get("name"),        // title
                        community.get("purpose"),     // summary
                        owner.get("name"),
                        community.get("createdAt"),
                        cb.nullLiteral(Long.class),   // viewCount
                        cb.nullLiteral(String.class)  // representativeImage 자리
                ))
          .where(predicates.toArray(new Predicate[0]))
          .orderBy(cb.desc(community.get("createdAt")));

        TypedQuery<CommunitySearchResultDto> query = em.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        List<CommunitySearchResultDto> baseItems = query.getResultList();

        if (baseItems.isEmpty()) {
            return new SearchResponse<>(Collections.emptyList(), 0L);
        }

        /* ============= 2단계: 썸네일 key 조회 ============= */

        List<Long> communityIds = baseItems.stream()
                .map(CommunitySearchResultDto::getCommunityId)
                .toList();

        // 대표 사진 = photoId 오름차순 첫 번째
        List<Object[]> thumbRows = em.createQuery(
                "select c.communityId, p.photoUrl " +
                "from CommunityPostPhoto p " +
                "join p.post cp " +
                "join cp.community c " +
                "where c.communityId in :ids " +
                "and cp.status = :status " +
                "order by c.communityId asc, p.photoId asc",
                Object[].class
        )
        .setParameter("ids", communityIds)
        .setParameter("status", CommunityPostStatus.REGISTERED)
        .getResultList();

        /* ============= 2-2: key → presigned URL 변환 ============= */

        Map<Long, String> thumbMap = new HashMap<>();

        for (Object[] row : thumbRows) {
            Long commId = (Long) row[0];
            String key = (String) row[1];   // 사실은 S3 key

            if (key == null) continue;
            if (thumbMap.containsKey(commId)) continue;

            // 🔥 핵심: S3 key → 브라우저에서 접근 가능한 URL 변환
            String signedUrl = awsService.toPreSignedUrl(key, Duration.ofMinutes(10));

            thumbMap.putIfAbsent(commId, signedUrl);
        }

        /* ============= 3단계: 최종 DTO 구성 ============= */

        List<CommunitySearchResultDto> finalItems = new ArrayList<>();

        for (CommunitySearchResultDto base : baseItems) {

            String finalUrl = thumbMap.get(base.getCommunityId());

            CommunitySearchResultDto dto = new CommunitySearchResultDto(
                    base.getCommunityId(),
                    base.getTitle(),
                    base.getSummary(),
                    base.getAuthorName(),
                    base.getCreatedAt(),
                    base.getViewCount(),
                    finalUrl    // ⬅️ 여기서 “프리사인 URL”이 들어감
            );

            finalItems.add(dto);
        }

        /* ============= total count 쿼리 ============= */
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Community> countRoot = countQuery.from(Community.class);
        Join<Community, User> countOwner =
                countRoot.join("owner", JoinType.LEFT);

        List<Predicate> countPredicates =
                buildPredicates(cb, countQuery, countRoot, countOwner, req);

        countQuery.select(cb.countDistinct(countRoot))
                  .where(countPredicates.toArray(new Predicate[0]));

        long total = em.createQuery(countQuery).getSingleResult();

        return new SearchResponse<>(finalItems, total);
    }

    /* 검색 조건 빌더 (기존 코드 동일) */
    private List<Predicate> buildPredicates(
            CriteriaBuilder cb,
            CriteriaQuery<?> parentQuery,
            Root<Community> community,
            Join<Community, User> owner,
            SearchRequest req
    ) {
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.notEqual(community.get("status"), CommunityStatus.DELETED));

        /* ... 기존 검색 조건 로직은 너 코드 그대로 유지 ... */

        return predicates;
    }
}
