package com.example.moduche.domain.course;

import com.example.moduche.domain.course.Course;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_photo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", foreignKey = @ForeignKey(name = "fk_course_photo_course"))
    private Course course;

    // S3 key 또는 URL
    private String photoUrl;
}
