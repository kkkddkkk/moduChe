package com.example.moduche.domain.notice.dto;

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
public class NoticePageForAllResponseDTO {
    private List<FetchNoticeForAllDTO> notices; // 실제 공지 리스트
    private long totalElements;           // 전체 데이터 수
    private int totalPages;               // 총 페이지 수
    private int currentPage;              // 현재 페이지
}
