package com.example.moduche.domain.banner.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner_duration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerDuration {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Integer days;
	
	@Column(precision = 10, scale = 2)
	private BigDecimal priceMultiplier;

}
