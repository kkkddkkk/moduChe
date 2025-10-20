package com.example.moduche.domain.course;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.login.User;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="course")
@Getter @Setter @NoArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long courseId;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="facility_id", foreignKey=@ForeignKey(name="fk_course_facility"))
    private Facility facility;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="created_by", foreignKey=@ForeignKey(name="fk_course_created_by"))
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "type_code", referencedColumnName = "type_code")
    private CourseType courseType;

    private String title;
    private String description;
    private Integer maxParticipants;
    private String format;
    private String accommodationOffered;
    private String disabilityType;
    private String courseStatus;
    private String guardianRequired;
}