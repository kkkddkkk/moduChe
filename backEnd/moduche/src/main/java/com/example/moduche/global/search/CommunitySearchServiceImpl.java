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

        // 1) 삭제된 커뮤니티 제외
        predicates.add(cb.notEqual(community.get("status"), CommunityStatus.DELETED));

        /* ===== 2) 키워드 검색: 커뮤니티 + 게시글 제목/해시태그 ===== */
        String rawKeyword = req.getKeyword();
        if (rawKeyword != null) {
            String keyword = rawKeyword.trim();
            if (!keyword.isEmpty()) {
                String like = "%" + keyword.toLowerCase() + "%";

                // (1) 커뮤니티 이름/목적
                Predicate nameLike = cb.like(
                        cb.lower(community.get("name")),
                        like
                );
                Predicate purposeLike = cb.like(
                        cb.lower(community.get("purpose")),
                        like
                );

                // (2) 커뮤니티 게시글 제목/해시태그
                Subquery<Long> postSub = parentQuery.subquery(Long.class);
                Root<CommunityPost> post = postSub.from(CommunityPost.class);

                postSub.select(cb.literal(1L))
                       .where(
                           cb.equal(post.get("community"), community),
                           cb.equal(post.get("status"), CommunityPostStatus.REGISTERED),
                           cb.or(
                               cb.like(cb.lower(post.get("title")), like),
                               cb.like(cb.lower(post.get("hashTags")), like)
                           )
                       );

                Predicate postExists = cb.exists(postSub);

                // (3) 세 개 중 하나라도 매치되면 OK
                predicates.add(cb.or(
                        nameLike,
                        purposeLike,
                        postExists
                ));
            }
        }

        /* ===== 3) 태그 검색 (커뮤니티 게시글 hashTags 기준) ===== */
        // QuickSearchBar 에서 온 req.getTags() 는 ["휠체어", "농구"] 이런 식이라고 가정
        List<String> tags = req.getTags();
        if (tags != null && !tags.isEmpty()) {

            List<Predicate> tagPredicates = new ArrayList<>();

            for (String rawTag : tags) {
                if (rawTag == null || rawTag.isBlank()) continue;

                String tag = rawTag.trim().toLowerCase();
                String likeTag = "%" + tag + "%";

                // exists (
                //   select 1 from CommunityPost p
                //   where p.community = community
                //     and p.status = REGISTERED
                //     and lower(p.hashTags) like '%tag%'
                // )
                Subquery<Long> sub = parentQuery.subquery(Long.class);
                Root<CommunityPost> post = sub.from(CommunityPost.class);

                sub.select(cb.literal(1L))
                   .where(
                       cb.equal(post.get("community"), community),
                       cb.equal(post.get("status"), CommunityPostStatus.REGISTERED),
                       cb.like(cb.lower(post.get("hashTags")), likeTag)
                   );

                tagPredicates.add(cb.exists(sub));
            }

            // 태그 여러 개면 "그 중 하나라도 포함" (OR) 로 처리
            if (!tagPredicates.isEmpty()) {
                predicates.add(cb.or(tagPredicates.toArray(new Predicate[0])));
            }
        }

        return predicates;
    }
}
