package com.example.moduche.domain.enrollment;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.login.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name="enrollment",
    uniqueConstraints = @UniqueConstraint(
        name="uk_enroll_user_course_session",
        columnNames={"user_id","course_id","session_id"} // session_id NULL 허용 (1회성 강좌)
    )
)
@Getter @Setter @NoArgsConstructor
public class Enrollment {

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long enrollId;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="course_id", foreignKey=@ForeignKey(name="fk_enroll_course"))
    private Course course;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="user_id", foreignKey=@ForeignKey(name="fk_enroll_user"))
    private User user;

    /** ⬇️ 세션은 선택(1회성 강좌일 때는 NULL) */
    @ManyToOne(fetch=FetchType.LAZY, optional = true)
    @JoinColumn(name="session_id", foreignKey=@ForeignKey(name="fk_enroll_session"))
    private CourseSession session;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private EnrollmentStatus status; // ENROLLED/CANCELLED/WAITLIST

    private Boolean caregiverAttend;       // 보호자 동반 여부
    private LocalDateTime enrolledAt;

    @PrePersist
    void prePersist() {
        if (status == null) status = EnrollmentStatus.ENROLLED;
        if (enrolledAt == null) enrolledAt = LocalDateTime.now();
        if (caregiverAttend == null) caregiverAttend = false;
    }
}
