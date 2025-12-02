package com.example.moduche.domain.course;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.tag.Tag;
import com.example.moduche.domain.login.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "course",
    schema = "moduche",
    indexes = {
        @Index(name = "idx_course_created_at_desc", columnList = "created_at"),
        @Index(name = "idx_course_status", columnList = "status")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;                 // 게시판 넘버링

    /** 관계들 */

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "facility_id", foreignKey = @ForeignKey(name = "fk_course_facility"), nullable = true)
    private Facility facility;

    @Builder.Default
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<CourseSession> sessions = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(name = "fk_course_created_by"))
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "type_code", referencedColumnName = "type_code", nullable = true)
    private CourseType courseType;

    /** 콘텐츠 */

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "instructor_name", length = 100)
    private String instructorName;

    @Column(length = 300)                   // 목록 카드용 요약
    private String summary;

    @Lob
    private String description;             // 상세 본문

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;            // 목록 이미지

    /** 운영/메타 */

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private CourseFormat format;            // ONLINE/OFFLINE/HYBRID

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private CourseStatus status;            // DRAFT/PUBLISHED/ARCHIVED/DELETED

    @Column(nullable = false)
    private Boolean accommodationOffered;   // 편의 제공 여부

    @Column(nullable = false)
    private Boolean guardianRequired;       // 보호자 동반 필요

    @Column(name = "disability_type", length = 50)
    private String disabilityType;          // (추후 테이블로 분리 추천)

    @Column(name = "view_count", nullable = false)
    private Long viewCount;                 // 인기순/통계

    // 운영주기 표시용 (예: "매주 월수금", "격주 화목", "5월 5일")
    @Column(name = "operation_schedule", length = 100)
    private String operationSchedule;

    /** 🔥 실제 활동 장소(외부 시설 포함) */

    @Column(name = "activity_place_name", length = 200)
    private String activityPlaceName;       // 예: "○○장애인체육관 2층 체육관"

    @Column(name = "activity_address", length = 300)
    private String activityAddress;         // 도로명 주소

    @Column(name = "activity_address_detail", length = 200)
    private String activityAddressDetail;   // 상세 주소 (층/호수 등)

    @Column(name = "activity_geo_lat", precision = 38, scale = 15)
    private BigDecimal activityGeoLat;

    @Column(name = "activity_geo_lng", precision = 38, scale = 15)
    private BigDecimal activityGeoLng;

    /** 타임스탬프 */

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** 기본값 */

    @PrePersist
    void prePersist() {
        if (status == null) status = CourseStatus.PUBLISHED;
        if (format == null) format = CourseFormat.OFFLINE;
        if (accommodationOffered == null) accommodationOffered = false;
        if (guardianRequired == null) guardianRequired = false;
        if (viewCount == null) viewCount = 0L;
    }

    @PreUpdate
    void preUpdate() { /* updatedAt은 Auditing이 처리 */ }

    public enum CourseFormat { ONLINE, OFFLINE, HYBRID }

    public enum CourseStatus { DRAFT, PUBLISHED, ARCHIVED, DELETED }

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "course_tag",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private java.util.Set<Tag> tags = new java.util.LinkedHashSet<>();
}
