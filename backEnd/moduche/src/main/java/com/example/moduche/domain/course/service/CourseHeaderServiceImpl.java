package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.course.DTO.*; // CourseHeaderResponse, SessionDto, FacilityHeaderDto
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseSessionRepository;
import com.example.moduche.domain.enrollment.EnrollmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseHeaderServiceImpl implements CourseHeaderService {

    private final CourseRepository courseRepository;
    private final CourseSessionRepository sessionRepository;
    private final EnrollmentRepository enrollmentRepository;

    private static final DateTimeFormatter UI_DT =
            DateTimeFormatter.ofPattern("MMM dd HH:mm", Locale.ENGLISH); // "Nov 04 19:00"

    @Override
    public CourseHeaderResponse getHeader(Long courseId) {
        Course c = courseRepository.findHeaderById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + courseId));

        // 1) 세션 로드
        List<CourseSession> sessions = sessionRepository
                .findByCourse_CourseIdOrderByStartDateAsc(courseId);

        // 2) DTO 변환 + 날짜 생성(datesBySession)
        List<SessionDto> sessionDtos = new ArrayList<>();
        Map<String, List<String>> datesBySession = new LinkedHashMap<>();

        int idx = 1;
        for (CourseSession s : sessions) {
            String sid = "S" + idx++;

            // ✅ 정원: 세션 override > 코스 maxParticipants
            int capacity = (s.getCapacityOverride() != null)
                    ? s.getCapacityOverride()
                    : (c.getMaxParticipants() != null ? c.getMaxParticipants() : 0);

            // ✅ 현재 신청 수
            long enrolled = enrollmentRepository.countSessionEnrolled(courseId, s.getSessionId());
            int remaining = Math.max(0, capacity - (int) enrolled);

            SessionDto dto = new SessionDto(
                    sid,
                    buildSessionLabel(s),
                    remaining,              // ✅ 이제 실제 값
                    s.getStartDate(),
                    s.getEndDate(),
                    s.getStartTime(),
                    s.getEndTime(),
                    s.getDowMask(),
                    s.getInterval(), remaining, remaining
            );
            sessionDtos.add(dto);
            datesBySession.put(sid, generateDateTimesForSession(s));
        }


        // 3) 기본 선택값: 첫 세션의 첫 날짜
        String defaultSessionId = sessionDtos.isEmpty() ? null : sessionDtos.get(0).id();
        String defaultDate = (defaultSessionId == null || datesBySession.get(defaultSessionId).isEmpty())
                ? null : datesBySession.get(defaultSessionId).get(0);

        // 4) 기간/스케줄 라인/태그/시설
        LocalDate periodStart = sessions.stream()
                .map(CourseSession::getStartDate)
                .filter(Objects::nonNull)
                .min(LocalDate::compareTo)
                .orElse(null);

        LocalDate periodEnd = sessions.stream()
                .map(CourseSession::getEndDate)
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null);

        String scheduleLine = buildScheduleLineFromGeneratedDates(datesBySession);
        List<String> tags = buildTagsFromCourse(c);

        // Facility 필드명: facilityName / facilityAddress / geoLat / geoLng
        FacilityHeaderDto facility = (c.getFacility() == null) ? null :
                new FacilityHeaderDto(
                        c.getFacility().getFacilityId(),
                        nvl(c.getFacility().getFacilityName(), "Center"),
                        composeOneLineAddress(c),
                        toStringOrNull(c.getFacility().getGeoLat()),
                        toStringOrNull(c.getFacility().getGeoLng())
                );

        // ✅ bylineName/Org: 등록자 + 시설명만 사용
        String bylineName = (c.getCreatedBy() != null && c.getCreatedBy().getName() != null)
                ? c.getCreatedBy().getName()
                : "Instructor";

        String bylineOrg = (c.getFacility() != null)
                ? nvl(c.getFacility().getFacilityName(), "Organization")
                : "Organization";

        return new CourseHeaderResponse(
                c.getTitle(),
                bylineName,
                bylineOrg,
                periodStart,
                periodEnd,
                scheduleLine,
                sessionDtos,
                datesBySession,
                defaultSessionId,
                defaultDate,
                tags,
                facility,
                c.getThumbnailUrl(),
                c.getMaxParticipants(),
                c.getFormat(),
                c.getStatus()
        );
    }

    /* ================= 내부 유틸 ================= */

    private static String buildSessionLabel(CourseSession s) {
        if (s.getStartDate() == null || s.getEndDate() == null) return "Session";
        String start = fmtMonthDay(s.getStartDate());
        String end   = fmtMonthDay(s.getEndDate());
        return "Block (" + start + "–" + end + ")";
    }

    private static String fmtMonthDay(LocalDate d) {
        String mon = d.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH);
        return mon + " " + d.getDayOfMonth();
    }

    /** dowMask + start/end + startTime으로 회차 날짜 문자열 생성 ("MMM dd HH:mm") */
    private List<String> generateDateTimesForSession(CourseSession s) {
        if (s.getStartDate() == null || s.getEndDate() == null
                || s.getStartTime() == null || s.getDowMask() == null) {
            return List.of();
        }

        String[] hhmm = s.getStartTime().split(":"); // "HH:mm"
        int h = Integer.parseInt(hhmm[0].trim());
        int m = Integer.parseInt(hhmm[1].trim());

        List<String> out = new ArrayList<>();
        LocalDate cur = s.getStartDate();
        LocalDate end = s.getEndDate();

        int weekInterval = (s.getInterval() == null || s.getInterval() < 1) ? 1 : s.getInterval();
        boolean[] active = toDowMaskArray(s.getDowMask()); // 월(0)~일(6)

        while (!cur.isAfter(end)) {
            LocalDate weekStart = cur;
            for (int i = 0; i < 7; i++) {
                LocalDate d = weekStart.plusDays(i);
                if (d.isAfter(end)) break;

                int dowIdx = dayOfWeekToMaskIndex(d.getDayOfWeek());
                if (dowIdx >= 0 && active[dowIdx]) {
                    LocalDateTime dt = d.atTime(h, m);
                    out.add(dt.format(UI_DT));
                }
            }
            cur = weekStart.plusWeeks(weekInterval);
        }
        return out;
    }

    private static boolean[] toDowMaskArray(String mask) {
        boolean[] a = new boolean[7];
        if (mask == null) return a;
        String m = mask.trim();
        for (int i = 0; i < Math.min(m.length(), 7); i++) {
            a[i] = (m.charAt(i) == '1');
        }
        return a;
    }

    private static int dayOfWeekToMaskIndex(DayOfWeek dow) {
        return switch (dow) {
            case MONDAY -> 0;
            case TUESDAY -> 1;
            case WEDNESDAY -> 2;
            case THURSDAY -> 3;
            case FRIDAY -> 4;
            case SATURDAY -> 5;
            case SUNDAY -> 6;
        };
    }

    private String buildScheduleLineFromGeneratedDates(Map<String, List<String>> datesBySession) {
        List<LocalDate> days = datesBySession.values().stream()
                .flatMap(List::stream)
                .map(this::parseMonthDayHour)
                .collect(Collectors.toList());

        if (days.isEmpty()) return "Schedule";

        LinkedHashSet<String> dows = new LinkedHashSet<>();
        for (LocalDate d : days) {
            dows.add(d.getDayOfWeek().getDisplayName(
                    java.time.format.TextStyle.SHORT, Locale.ENGLISH));
        }

        int total = days.size();
        LocalDate min = days.stream().min(LocalDate::compareTo).orElse(null);
        LocalDate max = days.stream().max(LocalDate::compareTo).orElse(null);
        long weeks = (min != null && max != null)
                ? Math.max(1, Duration.between(min.atStartOfDay(), max.plusDays(1).atStartOfDay()).toDays() / 7)
                : 1;

        return "Weekly • " + String.join("/", dows) + " • " + total + " Sessions / " + weeks + " Weeks";
    }

    private LocalDate parseMonthDayHour(String s) {
        DateTimeFormatter f = DateTimeFormatter.ofPattern("MMM dd HH:mm", Locale.ENGLISH);
        LocalDateTime dt = LocalDateTime.parse(s, f);
        return dt.toLocalDate();
    }

    private static List<String> buildTagsFromCourse(Course c) {
        List<String> tags = new ArrayList<>();
        if (c.getDisabilityType() != null) {
            for (String raw : c.getDisabilityType().split(",")) {
                switch (raw.trim().toUpperCase()) {
                    case "VISION" -> tags.add("시각");
                    case "HEARING" -> tags.add("청각");
                    case "MOBILITY" -> tags.add("지체");
                }
            }
        }
        if (Boolean.TRUE.equals(c.getGuardianRequired())) tags.add("보조인 가능");
        if (Boolean.TRUE.equals(c.getAccommodationOffered())) tags.add("편의 제공");
        return tags;
    }

    private static String composeOneLineAddress(Course c) {
        if (c.getFacility() == null) return null;
        String name = nvl(c.getFacility().getFacilityName(), "Center");
        String addr = nvl(c.getFacility().getFacilityAddress(), "");
        return addr.isBlank() ? name : (name + ", " + addr);
    }

    private static String toStringOrNull(java.math.BigDecimal v) {
        return (v == null) ? null : v.toPlainString();
    }

    private static String nvl(String s, String d) { return (s == null ? d : s); }
    private static boolean isBlank(String s) { return s == null || s.isBlank(); }
}
