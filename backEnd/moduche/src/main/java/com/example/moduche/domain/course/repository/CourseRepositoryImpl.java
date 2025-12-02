// com.example.moduche.domain.course.repository.CourseRepositoryImpl

package com.example.moduche.domain.course.repository;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.QCourse;
import com.example.moduche.domain.course.QCourseSession;
import com.example.moduche.domain.facility.QFacility;
import com.example.moduche.domain.tag.QTag;
import com.example.moduche.global.search.CourseSearchResultDto;
import com.example.moduche.global.search.SearchRequest;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CourseRepositoryImpl implements CourseSearchRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<CourseSearchResultDto> searchCourses(SearchRequest req) {

        QCourse course = QCourse.course;
        QFacility facility = QFacility.facility;
        QCourseSession session = QCourseSession.courseSession;
        QTag tag = QTag.tag;

        int page = Math.max(0, req.getPage());
        int size = req.getSize() > 0 ? req.getSize() : 20;

        BooleanExpression predicate = course.status.ne(Course.CourseStatus.DELETED);

        // keyword
        if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
            String kw = "%" + req.getKeyword().trim() + "%";
            predicate = predicate.and(
                    course.title.likeIgnoreCase(kw)
                            .or(course.summary.likeIgnoreCase(kw))
                            .or(course.description.likeIgnoreCase(kw))
                            .or(facility.facilityName.likeIgnoreCase(kw))
            );
        }

        // location
        if (req.getLocation() != null && !req.getLocation().isBlank()) {
            String loc = "%" + req.getLocation().trim() + "%";
            predicate = predicate.and(
                    facility.facilityAddress.likeIgnoreCase(loc)
                            .or(facility.facilityName.likeIgnoreCase(loc))
            );
        }

        // onlyUpcoming
        if (Boolean.TRUE.equals(req.getOnlyUpcoming())) {
            LocalDate today = LocalDate.now();
            predicate = predicate.and(session.endDate.goe(today));
        }

        // 기간
        if (req.getStartDate() != null && req.getEndDate() != null) {
            LocalDate s = req.getStartDate();
            LocalDate e = req.getEndDate();
            predicate = predicate.and(
                    session.startDate.loe(e)
                            .and(session.endDate.goe(s))
            );
        }

        // tags
        if (req.getTags() != null && !req.getTags().isEmpty()) {
            List<String> cleaned =
                    req.getTags().stream()
                            .filter(t -> t != null && !t.isBlank())
                            .map(t -> t.startsWith("#") ? t.substring(1) : t)
                            .toList();

            if (!cleaned.isEmpty()) {
                predicate = predicate.and(tag.name.in(cleaned));
            }
        }

        var query = queryFactory
                .select(Projections.constructor(
                        CourseSearchResultDto.class,
                        course.courseId,
                        course.title,
                        course.summary,
                        course.thumbnailUrl,
                        facility.facilityName,
                        facility.facilityAddress,
                        session.startDate.min(),
                        session.endDate.max(),
                        course.format,
                        course.status,
                        course.viewCount
                ))
                .from(course)
                .leftJoin(course.facility, facility)
                .leftJoin(course.sessions, session)
                .leftJoin(course.tags, tag)
                .where(predicate)
                .groupBy(
                        course.courseId,
                        course.title,
                        course.summary,
                        course.thumbnailUrl,
                        facility.facilityName,
                        facility.facilityAddress,
                        course.format,
                        course.status,
                        course.viewCount
                );

        String sortBy = req.getSortBy() != null ? req.getSortBy() : "LATEST";

        switch (sortBy) {
            case "POPULAR":
                query.orderBy(course.viewCount.desc(), course.createdAt.desc());
                break;
            case "CLOSEST":
                query.orderBy(session.startDate.asc());
                break;
            case "LATEST":
            default:
                query.orderBy(course.createdAt.desc());
        }

        long total = query.fetch().size();

        List<CourseSearchResultDto> items = query
                .offset((long) page * size)
                .limit(size)
                .fetch();

        return new PageImpl<>(items, PageRequest.of(page, size), total);
    }
}
