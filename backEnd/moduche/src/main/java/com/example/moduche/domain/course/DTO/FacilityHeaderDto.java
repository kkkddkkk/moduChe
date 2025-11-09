
package com.example.moduche.domain.course.DTO;

public record FacilityHeaderDto(
    Long facilityId,
    String name,          // 시설명
    String addressLine,   // "Gangnam Navi Center, Rm 302" 등 한 줄 주소
    String geoLat,
    String geoLng
) {}
