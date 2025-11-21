package com.example.moduche.domain.main.dto;

import java.math.BigDecimal;

public interface CloseCommunityDTO {
	    Long getCommunityId();
	    String getName();
	    String getFounder();
	    String getPurpose();
	    String getScheduleDetail();
	    BigDecimal getGeoLat();
	    BigDecimal getGeoLng();
	    Double getDistance(); // distance까지 가져오고 싶다면
}
