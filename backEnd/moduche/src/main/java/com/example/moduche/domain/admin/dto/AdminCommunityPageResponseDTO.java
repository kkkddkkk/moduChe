package com.example.moduche.domain.admin.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@ToString
public class AdminCommunityPageResponseDTO {
    private List<FetchCommunityDTO> communities; // 실제 동아리 리스트
    private long totalElements;           // 전체 데이터 수
    private int totalPages;               // 총 페이지 수
    private int currentPage;              // 현재 페이지
    private Long activedElements;        //활성화된 데이터 수
    private Long registeredElements;    //등록 신청 중 데이터 수

}
