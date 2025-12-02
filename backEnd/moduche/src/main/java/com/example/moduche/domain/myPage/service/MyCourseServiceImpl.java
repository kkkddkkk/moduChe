package com.example.moduche.domain.myPage.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseEnrollment;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.course.repository.CourseEnrollmentRepository;
import com.example.moduche.domain.course.repository.CourseSessionRepository;
import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.myPage.dto.MyEnrolledCourseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyCourseServiceImpl implements MyCourseService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseSessionRepository courseSessionRepository;

    @Override
    public List<MyEnrolledCourseResponse> getMyEnrolledCourses(Long userId) {
        // 🔹 여기서 바로 네가 정의한 쿼리 사용
        List<CourseEnrollment> list =
                enrollmentRepository.findAllWithCourseByUser(userId);

        LocalDate today = LocalDate.now();

        return list.stream()
                .map(e -> {
                    Course c = e.getCourse();
                    Facility f = c.getFacility();

                    // ✅ sessionId(Long) → CourseSession 조회
                    CourseSession s = null;
                    if (e.getSessionId() != null) {
                        s = courseSessionRepository
                                .findById(e.getSessionId())
                                .orElse(null);
                    }

                    // ===== ① 기간: "2025.01.10 ~ 2025.03.10" =====
                    String period = null;
                    if (s != null && s.getStartDate() != null && s.getEndDate() != null) {
                        period = formatDateRange(s.getStartDate(), s.getEndDate());
                    }

                    // ===== ② 요일/시간: "월수금 19:00 ~ 21:00" =====
                    String dayTime = null;
                    if (s != null) {
                        dayTime = buildDayTime(s);
                    }

                    // ===== ③ 상태: ongoing / finished =====
                    String status = "ongoing";
                    if (s != null && s.getEndDate() != null && s.getEndDate().isBefore(today)) {
                        status = "finished";
                    }

                    return MyEnrolledCourseResponse.builder()
                            .enrollmentId(e.getEnrollmentId())
                            .courseId(c.getCourseId())
                            .title(c.getTitle())
                            .facilityName(f != null ? f.getFacilityName() : null)
                            .period(period)
                            .dayTime(dayTime)
                            .status(status)
                            .build();
                })
                .toList();
    }

    /** yyyy-MM-dd → yyyy.MM.dd ~ yyyy.MM.dd */
    private String formatDateRange(LocalDate start, LocalDate end) {
        return formatDate(start) + " ~ " + formatDate(end);
    }

    private String formatDate(LocalDate date) {
        if (date == null) return null;
        return date.toString().replace("-", ".");
    }

    /** "1010100" + "19:00/21:00" → "월수금 19:00 ~ 21:00" */
    private String buildDayTime(CourseSession s) {
        String days = convertDowMask(s.getDowMask());
        String time = null;

        if (s.getStartTime() != null && s.getEndTime() != null) {
            time = s.getStartTime() + " ~ " + s.getEndTime();
        }

        if (!isEmpty(days) && !isEmpty(time)) {
            return days + " " + time;
        } else if (!isEmpty(days)) {
            return days;
        } else {
            return time;
        }
    }

    /** dowMask → "월수금" */
    private String convertDowMask(String mask) {
        if (mask == null) return "";
        String[] labels = {"월", "화", "수", "목", "금", "토", "일"};
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 7 && i < mask.length(); i++) {
            if (mask.charAt(i) == '1') {
                sb.append(labels[i]);
            }
        }
        return sb.toString();
    }

    private boolean isEmpty(String s) {
        return s == null || s.isBlank();
    }
}
