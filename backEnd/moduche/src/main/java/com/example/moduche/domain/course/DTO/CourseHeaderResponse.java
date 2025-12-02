package com.example.moduche.domain.course.DTO;

import com.example.moduche.domain.course.Course;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseHeaderResponse {

    // 1) 기본 정보
    private String title;
    private String bylineName;
    private String bylineOrg;

    // 2) 기간
    private LocalDate periodStart;
    private LocalDate periodEnd;

    // 3) 운영 스케줄 한 줄 요약
    private String scheduleLine;

    // 4) 세션 / 날짜 정보
    //    🔥 이제 여기서 record SessionDto 사용
    private List<SessionDto> sessions;
    private Map<String, List<String>> datesBySession;

    // 5) 기본 선택 세션/날짜
    private String defaultSessionId;
    private String defaultDate;

    // 6) 태그 리스트
    private List<String> tags;

    // 7) 시설 요약 정보
    private FacilityHeaderDto facility;

    // 8) 실제 활동 장소
    private String activityPlaceName;
    private String activityAddress;
    private String activityAddressDetail;

    // 9) 썸네일 및 메타
    private String thumbnailUrl;
    private Integer maxParticipants;

    private Course.CourseFormat format;
    private Course.CourseStatus status;
}
