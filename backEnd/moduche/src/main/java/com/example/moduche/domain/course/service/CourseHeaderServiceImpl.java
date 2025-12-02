package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.course.DTO.CourseHeaderResponse;
import com.example.moduche.domain.course.DTO.FacilityHeaderDto;
import com.example.moduche.domain.course.DTO.SessionDto;
import com.example.moduche.domain.course.Enums.EnrollmentStatus;
import com.example.moduche.domain.course.repository.CourseEnrollmentRepository;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseSessionRepository;

import com.example.moduche.global.AWS.service.S3UrlSigner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
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
    private final CourseEnrollmentRepository enrollmentRepository;
    private final S3UrlSigner s3UrlSigner;

    /** 상세 날짜 표시용 포맷: "Nov 04 19:00" */
    private static final DateTimeFormatter UI_DT =
            DateTimeFormatter.ofPattern("MMM dd HH:mm", Locale.ENGLISH);

    @Override
    public CourseHeaderResponse getHeader(Long courseId) {

        System.out.println(">>> getHeader called with id = " + courseId);

        Course c = courseRepository.findHeaderById(courseId)
                .orElseThrow(() -> {
                    System.out.println(">>> NO course found with id = " + courseId);
                    return new NoSuchElementException("Course not found: " + courseId);
                });

        System.out.println(">>> building header response for courseId = " + c.getCourseId());

        // 1) 세션 로드
        List<CourseSession> sessions =
                sessionRepository.findByCourse_CourseIdOrderByStartDateAsc(courseId);

        // 2) 세션 DTO + datesBySession 생성
        List<SessionDto> sessionDtos = new ArrayList<>();
        Map<String, List<String>> datesBySession = new LinkedHashMap<>();

        int sidIndex = 1; // "S1", "S2", ...

        for (CourseSession s : sessions) {
            if (s.getStartDate() == null || s.getEndDate() == null) continue;

            List<LocalDate[]> monthlyBlocks = splitIntoMonthlyBlocks(
                    s.getStartDate(),
                    s.getEndDate()
            );

            for (LocalDate[] block : monthlyBlocks) {
                LocalDate blockStart = block[0];
                LocalDate blockEnd   = block[1];

                String sid = "S" + sidIndex;

                // ✅ 정원: override > course.maxParticipants
                int capacity = (s.getCapacityOverride() != null)
                        ? s.getCapacityOverride()
                        : (c.getMaxParticipants() != null ? c.getMaxParticipants() : 0);

                // ✅ 승인(APPROVED)된 인원 수
                long approvedCount = enrollmentRepository
                	    .countByCourse_CourseIdAndSessionIdAndStatus(
                	        c.getCourseId(),
                	        s.getSessionId(),
                	        EnrollmentStatus.APPROVED
                	    );
                int enrolled = (int) approvedCount;

                // ✅ 잔여석 = 정원 - 승인 인원
                int remaining = Math.max(0, capacity - enrolled);

                // 🔹 회차 라벨
                String label = buildBlockLabelWithDetail(
                        s,
                        blockStart,
                        blockEnd,
                        sidIndex,
                        c
                );

                // 🔥 SessionDto 생성
                SessionDto dto = new SessionDto(
                        sid,
                        label,
                        remaining,
                        blockStart,
                        blockEnd,
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getDowMask(),
                        s.getInterval(),
                        capacity,
                        enrolled,
                        s.getSessionId()   // ✅ 실제 DB PK
                );
                sessionDtos.add(dto);

                datesBySession.put(
                        sid,
                        generateDateTimesForSessionWithin(s, blockStart, blockEnd)
                );

                // (선택) 디버그 로그
                System.out.printf(
                        "[HEADER DEBUG] courseId=%d, sessionDbId=%d, sid=%s, cap=%d, enrolled=%d, remaining=%d%n",
                        c.getCourseId(),
                        s.getSessionId(),
                        sid,
                        capacity,
                        enrolled,
                        remaining
                );

                sidIndex++;
            }
        }

        // 3) 기본 선택값: 첫 세션의 첫 날짜
        String defaultSessionId = sessionDtos.isEmpty() ? null : sessionDtos.get(0).id();
        String defaultDate = null;
        if (defaultSessionId != null) {
            List<String> firstDates = datesBySession.get(defaultSessionId);
            if (firstDates != null && !firstDates.isEmpty()) {
                defaultDate = firstDates.get(0);
            }
        }

        // 4) 전체 기간 계산
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

        // 5) 운영주기 한 줄 (operationSchedule > 세션 정보 > datesBySession 순으로 fallback)
        String scheduleLine;
        if (!isBlank(c.getOperationSchedule())) {
            scheduleLine = c.getOperationSchedule();
        } else if (!sessions.isEmpty() && sessions.get(0).getDowMask() != null) {
            scheduleLine = buildScheduleLineFromSession(sessions.get(0));
        } else {
            scheduleLine = buildScheduleLineFromGeneratedDates(datesBySession);
        }

        // 6) 태그
        List<String> tags = buildTagsFromCourse(c);

        // 7) 시설 요약 정보
        FacilityHeaderDto facility = (c.getFacility() == null) ? null :
                new FacilityHeaderDto(
                        c.getFacility().getFacilityId(),
                        nvl(c.getFacility().getFacilityName(), "Center"),
                        composeOneLineAddress(c),
                        toStringOrNull(c.getFacility().getGeoLat()),
                        toStringOrNull(c.getFacility().getGeoLng())
                );

        // 8) 바이라인 (왼쪽: 강사/생성자, 오른쪽: 시설명)
        String bylineName;
        if (!isBlank(c.getInstructorName())) {
            bylineName = c.getInstructorName();
        } else if (c.getCreatedBy() != null && !isBlank(c.getCreatedBy().getName())) {
            bylineName = c.getCreatedBy().getName();
        } else {
            bylineName = "Instructor";
        }

        String bylineOrg = (c.getFacility() != null)
                ? nvl(c.getFacility().getFacilityName(), "Organization")
                : "Organization";

        // 9) 썸네일 presigned URL
        String thumbnailUrl = null;
        String thumbKey = c.getThumbnailUrl();   // ex) "course/xxxxx.webp"
        if (!isBlank(thumbKey)) {
            URL signed = s3UrlSigner.sign(thumbKey, Duration.ofMinutes(30));
            thumbnailUrl = signed.toString();
        }

        System.out.println("=== DEBUG: returning header for courseId = " + c.getCourseId());

        // 🔟 최종 응답 DTO
        return CourseHeaderResponse.builder()
                .title(c.getTitle())
                .bylineName(bylineName)
                .bylineOrg(bylineOrg)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .scheduleLine(scheduleLine)
                .sessions(sessionDtos)
                .datesBySession(datesBySession)
                .defaultSessionId(defaultSessionId)
                .defaultDate(defaultDate)
                .tags(tags)
                .facility(facility)
                .thumbnailUrl(thumbnailUrl)
                .maxParticipants(c.getMaxParticipants())
                .format(c.getFormat())
                .status(c.getStatus())
                .build();
    }

    /* ====================== 내부 유틸들 ====================== */

    /** 세션의 start~end를 월별 block 리스트로 쪼갬 */
    private List<LocalDate[]> splitIntoMonthlyBlocks(LocalDate start, LocalDate end) {
        List<LocalDate[]> blocks = new ArrayList<>();
        if (start == null || end == null || start.isAfter(end)) return blocks;

        LocalDate curStart = start;

        while (!curStart.isAfter(end)) {
            YearMonth ym = YearMonth.from(curStart);
            LocalDate monthEnd = ym.atEndOfMonth();

            LocalDate blockStart = curStart;
            LocalDate blockEnd = monthEnd.isBefore(end) ? monthEnd : end;

            blocks.add(new LocalDate[]{blockStart, blockEnd});
            curStart = blockEnd.plusDays(1);
        }
        return blocks;
    }

    /** "1회차 · 2025.11.29 ~ 2025.12.20 · 매주 월수 18:00 ~ 20:00" 형태 라벨 생성 */
    private String buildBlockLabelWithDetail(
            CourseSession s,
            LocalDate blockStart,
            LocalDate blockEnd,
            int blockIndex,
            Course c
    ) {
        if (blockStart == null || blockEnd == null) return blockIndex + "회차";

        DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String startStr = blockStart.format(DATE_FMT);
        String endStr   = blockEnd.format(DATE_FMT);

        String freq = "매주";
        Integer interval = s.getInterval();
        if (interval != null) {
            freq = switch (interval) {
                case 1 -> "매주";
                case 2 -> "격주";
                case 4 -> "매월";
                default -> "매주";
            };
        }

        String days = dowMaskToKoreanDays(s.getDowMask());

        String timeRange = "";
        if (s.getStartTime() != null && s.getEndTime() != null) {
            timeRange = s.getStartTime() + " ~ " + s.getEndTime();
        }

        StringBuilder sb = new StringBuilder();
        sb.append(blockIndex).append("회차 · ")
          .append(startStr).append(" ~ ").append(endStr);

        if (!days.isBlank()) {
            sb.append(" · ").append(freq).append(" ").append(days);
        }
        if (!timeRange.isBlank()) {
            sb.append(" ").append(timeRange);
        }

        return sb.toString();
    }

    /** block 범위 안에서만 수업 날짜/시간 리스트 생성 ("Nov 04 19:00" 형태) */
    private List<String> generateDateTimesForSessionWithin(
            CourseSession s,
            LocalDate blockStart,
            LocalDate blockEnd
    ) {
        if (blockStart == null || blockEnd == null
                || s.getStartTime() == null || s.getDowMask() == null) {
            return List.of();
        }

        String[] hhmm = s.getStartTime().split(":");
        int h = Integer.parseInt(hhmm[0].trim());
        int m = Integer.parseInt(hhmm[1].trim());

        List<String> out = new ArrayList<>();
        LocalDate cur = blockStart;
        LocalDate end = blockEnd;

        int weekInterval = (s.getInterval() == null || s.getInterval() < 1) ? 1 : s.getInterval();
        boolean[] active = toDowMaskArray(s.getDowMask());

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

    /** datesBySession 기반으로 "Weekly • Mon/Wed • N Sessions / M Weeks" 형태 문자열 만들기 */
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

    /** 코스의 장애타입 / 보조인 / 편의제공을 태그로 변환 */
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

    private String buildScheduleLineFromSession(CourseSession s) {
        String freq = "매주";
        Integer interval = s.getInterval();
        if (interval != null) {
            freq = switch (interval) {
                case 1 -> "매주";
                case 2 -> "격주";
                case 4 -> "매월";
                default -> "매주";
            };
        }

        String days = dowMaskToKoreanDays(s.getDowMask());

        if (isBlank(days)) return freq;
        return freq + " " + days;
    }

    private String dowMaskToKoreanDays(String mask) {
        if (isBlank(mask)) return "";
        String m = mask.trim();
        if (m.length() < 7) {
            m = String.format("%-7s", m).replace(' ', '0');
        }

        String[] labels = { "월", "화", "수", "목", "금", "토", "일" };
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 7; i++) {
            if (m.charAt(i) == '1') sb.append(labels[i]);
        }
        return sb.toString();
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
