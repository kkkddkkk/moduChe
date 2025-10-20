package com.example.moduche.domain.enrollment;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.login.User;

import lombok.*;

@Entity @Table(name="enrollment",
uniqueConstraints=@UniqueConstraint(name="uk_enroll_user_course", columnNames={"user_id","course_id"}))
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

private String status;             // ENROLLED/CANCELLED/WAITLIST
private Boolean caregiverAttend;   // 보호자 동반 여부
private LocalDateTime enrolledAt;
}