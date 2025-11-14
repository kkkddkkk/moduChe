package com.example.moduche.domain.facility;

import jakarta.persistence.*;
import java.math.BigDecimal;

import com.example.moduche.domain.facility.enums.FacilityStatus;

import lombok.*;

@Entity @Table(name="facility")
@Getter @Setter @NoArgsConstructor
@Builder @AllArgsConstructor
public class Facility {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long facilityId;
  private String facilityName;
  private String facilityType;
  private String facilityAddress;
  
  @Column(precision = 38, scale = 15)
  private BigDecimal geoLat;
  @Column(precision = 38, scale = 15)
  private BigDecimal geoLng;
  private String facilityPhone;
  private String openHours;
  private String accessibilityFeatures;
  private String business_num;
  private String boss;
  
  @Enumerated(EnumType.STRING) 
  private FacilityStatus status;
}