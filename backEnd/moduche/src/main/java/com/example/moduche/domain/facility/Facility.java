package com.example.moduche.domain.facility;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "facility")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facility_id", nullable = false)
    private Long facilityId;
    @Column(name = "facility_name", nullable = true)
    private String facilityName;
    @Column(name = "facility_type", nullable = true)
    private String facilityType;
    @Column(name = "facility_address", nullable = true)
    private String facilityAddress;
    @Column(name = "geo_lat", nullable = true)
    private BigDecimal geoLat;
    @Column(name = "geo_lng", nullable = true)
    private BigDecimal geoLng;
    @Column(name = "facility_phone", nullable = true)
    private String facilityPhone;
    @Column(name = "open_hours", nullable = true)
    private String openHours;
    @Column(name = "accessibility_features", nullable = true)
    private String accessibilityFeatures;
}