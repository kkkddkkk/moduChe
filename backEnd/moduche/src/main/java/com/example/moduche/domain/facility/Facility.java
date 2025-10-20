package com.example.moduche.domain.facility;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity @Table(name="facility")
@Getter @Setter @NoArgsConstructor
public class Facility {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long facilityId;
  private String facilityName;
  private String facilityType;
  private String facilityAddress;
  private BigDecimal geoLat;
  private BigDecimal geoLng;
  private String facilityPhone;
  private String openHours;
  private String accessibilityFeatures;
}