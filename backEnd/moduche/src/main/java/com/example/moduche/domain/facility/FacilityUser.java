package com.example.moduche.domain.facility;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "facilityuser")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class FacilityUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facility_id", nullable = false)
    private Long facilityId;
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "role_in_fac", nullable = true)
    private String roleInFac;
    @Column(name = "is_active", nullable = true)
    private Boolean isActive;
    @Column(name = "joined_at", nullable = true)
    private LocalDateTime joinedAt;
}