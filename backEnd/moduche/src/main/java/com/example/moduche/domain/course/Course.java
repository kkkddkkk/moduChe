package com.example.moduche.domain.course;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.tag.Tag;
import com.example.moduche.domain.login.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

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
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Course {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;                 // ✅ 게시판 넘버링

    /** 관계들 */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "facility_id", foreignKey = @ForeignKey(name = "fk_course_facility"),nullable = true )
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(name = "fk_course_created_by"))
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "type_code", referencedColumnName = "type_code", nullable = true)
    private CourseType courseType;

    /** 콘텐츠 */
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 300)                   // ✅ 목록 카드용 요약
    private String summary;

    @Lob
    private String description;             // 상세 본문

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;            // ✅ 목록 이미지

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
    private Long viewCount;                 // ✅ 인기순/통계

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
    @PreUpdate void preUpdate() { /* updatedAt은 Auditing이 처리 */ }
    public enum CourseFormat { ONLINE, OFFLINE, HYBRID }
    public enum CourseStatus { DRAFT, PUBLISHED, ARCHIVED, DELETED }
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
      name = "course_tag",
      joinColumns = @JoinColumn(name = "course_id"),
      inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private java.util.Set<Tag> tags = new java.util.LinkedHashSet<>();
}
