package com.example.moduche.domain.banner.entity;

import java.math.BigDecimal;

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
@Table(name = "banner_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String label; // 배너 유형 (상단/사이드/메인)
	
	private BigDecimal basePrice; //혓식에 따른 배너 "기본금".
}
