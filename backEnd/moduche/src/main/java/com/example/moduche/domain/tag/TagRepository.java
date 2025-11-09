package com.example.moduche.domain.tag;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("""
      select t.name
      from Course c
      join c.tags t
      where c.courseId = :courseId
      order by t.name asc
    """)
    List<String> findTagNamesByCourseId(@Param("courseId") Long courseId);
}
