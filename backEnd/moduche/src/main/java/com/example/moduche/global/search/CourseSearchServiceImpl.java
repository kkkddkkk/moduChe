package com.example.moduche.global.search;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.Course.CourseStatus;
import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.tag.Tag;
import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseSearchServiceImpl implements CourseSearchService {

    private final EntityManager em;

    @Override
    public SearchResponse<CourseSearchResultDto> search(SearchRequest req) {

        int page = Math.max(0, req.getPage());
        int size = req.getSize() > 0 ? req.getSize() : 20;

        CriteriaBuilder cb = em.getCriteriaBuilder();

        /* ======================
         * 1) 결과 조회 쿼리
         * ====================== */
        CriteriaQuery<CourseSearchResultDto> cq =
                cb.createQuery(CourseSearchResultDto.class);

        Root<Course> course = cq.from(Course.class);
        Join<Course, Facility> facility = course.join("facility", JoinType.LEFT);

        List<Predicate> predicates =
                buildPredicates(cb, cq, course, facility, req);

        cq.select(cb.construct(
                        CourseSearchResultDto.class,
                        course.get("courseId"),
                        course.get("title"),
                        course.get("summary"),
                        course.get("thumbnailUrl"),
                        facility.get("facilityName"),
                        facility.get("facilityAddress"),
                        cb.nullLiteral(LocalDate.class), // periodStart
                        cb.nullLiteral(LocalDate.class), // periodEnd
                        course.get("format"),
                        course.get("status"),
                        course.get("viewCount")
                ))
                .where(predicates.toArray(new Predicate[0]));

        applySort(cb, cq, course, req.getSortBy());

        List<CourseSearchResultDto> items = em.createQuery(cq)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();


        /* ======================
         * 2) total count 쿼리
         * ====================== */
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Course> countRoot = countQuery.from(Course.class);
        Join<Course, Facility> countFacility = countRoot.join("facility", JoinType.LEFT);

        List<Predicate> countPredicates =
                buildPredicates(cb, countQuery, countRoot, countFacility, req);

        countQuery.select(cb.count(countRoot))
                .where(countPredicates.toArray(new Predicate[0]));

        long total = em.createQuery(countQuery).getSingleResult();

        return new SearchResponse<>(items, total);
    }


    /**
     * 공통 where 조건 + tag 서브쿼리 처리
     */
    private <T> List<Predicate> buildPredicates(
            CriteriaBuilder cb,
            CriteriaQuery<T> cq,
            Root<Course> course,
            Join<Course, Facility> facility,
            SearchRequest req
    ) {
        List<Predicate> predicates = new ArrayList<>();

        /* 1) 기본: 삭제 제외 */
        predicates.add(cb.notEqual(course.get("status"), Course.CourseStatus.DELETED));

        /* 2) 키워드 검색: title OR summary OR facilityName */
        if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
            String kw = "%" + req.getKeyword().toLowerCase(Locale.ROOT) + "%";

            Predicate byTitle = cb.like(cb.lower(course.get("title")), kw);
            Predicate bySummary = cb.like(cb.lower(course.get("summary")), kw);
            Predicate byFacilityName =
                    cb.like(cb.lower(facility.get("facilityName")), kw);

            predicates.add(cb.or(byTitle, bySummary, byFacilityName));
        }

        /* 3) 위치 검색 */
        if (req.getLocation() != null && !req.getLocation().isBlank()) {
            String loc = "%" + req.getLocation().toLowerCase(Locale.ROOT) + "%";

            predicates.add(
                    cb.like(cb.lower(facility.get("facilityAddress")), loc)
            );
        }

        /* 4) 날짜 검색 (createdAt 기준) */
        if (req.getStartDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                    course.get("createdAt"),
                    req.getStartDate().atStartOfDay()
            ));
        }
        if (req.getEndDate() != null) {
            predicates.add(cb.lessThan(
                    course.get("createdAt"),
                    req.getEndDate().plusDays(1).atStartOfDay()
            ));
        }

        /* 5) onlyUpcoming */
        if (Boolean.TRUE.equals(req.getOnlyUpcoming())) {
            predicates.add(cb.equal(course.get("status"), Course.CourseStatus.PUBLISHED));
            predicates.add(cb.greaterThanOrEqualTo(
                    course.get("createdAt"),
                    LocalDate.now().atStartOfDay()
            ));
        }

        /* 6) TAGS — 서브쿼리 방식 적용 */
        if (req.getTags() != null && !req.getTags().isEmpty()) {

            List<String> normalized = req.getTags().stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(s -> s.startsWith("#") ? s.substring(1) : s)
                    .map(s -> s.toLowerCase(Locale.ROOT))
                    .toList();

            if (!normalized.isEmpty()) {

                /* exists (select 1 from course_tag t where t.course_id = course.id AND tag.name IN (...)) */
                Subquery<Long> sub = cq.subquery(Long.class);
                Root<Tag> tagRoot = sub.from(Tag.class);

                Join<Tag, Course> tagCourseJoin = tagRoot.join("courses", JoinType.INNER); 
                // ★ Tag.entity의 mappedBy로 조인됨 (필드명 맞을 것)

                Expression<String> tagName = cb.lower(tagRoot.get("name"));

                sub.select(cb.literal(1L))
                        .where(
                                cb.equal(tagCourseJoin.get("courseId"), course.get("courseId")),
                                tagName.in(normalized)
                        );

                predicates.add(cb.exists(sub));
            }
        }

        return predicates;
    }


    /** 정렬 */
    private void applySort(CriteriaBuilder cb, CriteriaQuery<?> cq, Root<Course> course, String sortBy) {
        String key = (sortBy == null ? "LATEST" : sortBy).toUpperCase(Locale.ROOT);

        switch (key) {
            case "POPULAR" ->
                    cq.orderBy(
                            cb.desc(course.get("viewCount")),
                            cb.desc(course.get("createdAt"))
                    );
            case "LATEST" -> cq.orderBy(cb.desc(course.get("createdAt")));
            default -> cq.orderBy(cb.desc(course.get("createdAt")));
        }
    }
}