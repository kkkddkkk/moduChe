package com.example.moduche.domain.main.dto;

import java.math.BigDecimal;

public interface CloseFacilityDTO {
	    Long getFacilityId();
	    String getFacilityName();
	    String getFacilityPhone();
	    String getFacilityType();
	    String getOpenHours();
	    BigDecimal getGeoLat();
	    BigDecimal getGeoLng();
	    Double getDistance(); // distance까지 가져오고 싶다면
}
