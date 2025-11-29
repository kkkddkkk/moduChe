package com.example.moduche.domain.banner.utility;

import com.example.moduche.domain.banner.entity.Banner;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BannerScore {
	private Banner banner;
    private double score;
    private String imageUrl; 
	private String redirectUrl;

}
