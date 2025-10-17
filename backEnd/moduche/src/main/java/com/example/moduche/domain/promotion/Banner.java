package com.example.moduche.domain.promotion;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "banner")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id", nullable = false)
    private Long bannerId;
    @Column(name = "admin_id", nullable = true)
    private Long adminId;
    @Column(name = "title", nullable = true)
    private String title;
    @Column(name = "image_url", nullable = true)
    private String imageUrl;
    @Column(name = "target_url", nullable = true)
    private String targetUrl;
    @Column(name = "location", nullable = true)
    private String location;
    @Column(name = "start_date", nullable = true)
    private LocalDateTime startDate;
    @Column(name = "end_date", nullable = true)
    private LocalDateTime endDate;
    @Column(name = "order_index", nullable = true)
    private Integer orderIndex;
}