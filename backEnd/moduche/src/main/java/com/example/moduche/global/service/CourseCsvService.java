package com.example.moduche.global.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.Course.CourseFormat;
import com.example.moduche.domain.course.Course.CourseStatus;
import com.example.moduche.domain.course.CourseType;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseTypeRepository;
import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.repository.FacilityRepository;

import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;

@Service
public class CourseCsvService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public CourseCsvService(
            CourseRepository courseRepository,
            CourseTypeRepository courseTypeRepository,
            FacilityRepository facilityRepository,
            UserRepository userRepository
    ) {
        this.courseRepository = courseRepository;
        this.courseTypeRepository = courseTypeRepository;
        this.facilityRepository = facilityRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void importCsv(File file) throws Exception {

        // "로 감싸진 필드 + 줄바꿈 포함 가능한 CSV 파서
        CSVParser parser = new CSVParserBuilder()
                .withSeparator(',')
                .withQuoteChar('"')
                .build();

        try (BufferedReader br = Files.newBufferedReader(file.toPath(), StandardCharsets.UTF_8);
             CSVReader reader = new CSVReaderBuilder(br)
                     .withCSVParser(parser)
                     .withSkipLines(1) // 헤더 1줄 스킵
                     .build()) {

            String[] row;

            while ((row = reader.readNext()) != null) {
                if (row.length < 10) {
                    // 컬럼 수가 부족하면 스킵
                    continue;
                }

                // CSV 컬럼 매핑
                String itemCd      = safe(row, 0); // 종목 코드 (예: "01")
                String itemNm      = safe(row, 1); // 종목 이름 (예: "검도")
                String courseNm    = safe(row, 2); // 강좌명
                String disability  = safe(row, 3); // 장애 유형 문자열
                String begin       = safe(row, 4); // 시작 시간 문자열
                String end         = safe(row, 5); // 종료 시간 문자열
                String flag        = safe(row, 6); // 요일 플래그
                String detail      = row[7];       // 설명은 일부가 null/빈문자일 수 있음(줄바꿈 포함)
                String accom       = safe(row, 8); // 편의제공 여부 Y/N
                String price       = safe(row, 9); // 가격 문자열

                // ---------- FK 매핑: CourseType ----------
                // itemCd(예: "01")를 type_code로 사용, itemNm(예: "검도")를 이름으로 사용
                CourseType courseType = null;
                if (itemCd != null && !itemCd.isBlank()) {
                    String typeCode = itemCd;     // PK
                    String typeName = itemNm;     // 화면용 이름 (필드명에 맞춰 수정)

                    courseType = courseTypeRepository.findById(typeCode)
                            .orElseGet(() -> {
                                CourseType t = new CourseType();
                                // ⚠️ 아래 필드명은 실제 CourseType 엔티티에 맞춰 수정해야 함
                                t.setTypeCode(typeCode);   // 예: @Id String typeCode;
                                t.setTypeName(typeName);   // 예: String typeName; (혹은 name/label 등)
                                return courseTypeRepository.save(t);
                            });
                }

                // ---------- FK 매핑: Facility ----------
                // 공공데이터라 지금은 매핑 불가능 → nullable 허용 상태 기준으로 일단 null
                Facility facility = null;
                // 만약 테스트용으로 하나 고정으로 묶고 싶으면:
                // Facility facility = facilityRepository.findById(1L).orElse(null);

                // ---------- FK 매핑: createdBy ----------
                // CSV에서 강좌 등록자를 구분할 수 없으니, 일단 관리자 유저(예: id = 1)로 고정
                User creator = userRepository.findById(1L).orElse(null);

                // ---------- summary 구성 ----------
                String summary = String.format(
                        "%s ~ %s / 요일코드:%s / 가격:%s원",
                        begin, end, flag, price
                );

                // ---------- Course 엔티티 생성 ----------
                Course c = Course.builder()
                        .facility(facility)
                        .createdBy(creator)
                        .courseType(courseType)
                        .title(courseNm)
                        .summary(summary)
                        .description(detail)
                        .thumbnailUrl(null)
                        .maxParticipants(20)
                        .format(CourseFormat.OFFLINE)
                        .status(CourseStatus.PUBLISHED)
                        .accommodationOffered("Y".equalsIgnoreCase(accom))
                        .guardianRequired(false)
                        .disabilityType(disability)
                        .viewCount(0L)
                        .build();

                // createdAt / updatedAt을 Auditing으로 쓰고 있으면 생략 가능.
                // 혹시 불안하면 아래처럼 직접 넣어도 됨 (필드가 public setter 있으면):
                // LocalDateTime now = LocalDateTime.now();
                // c.setCreatedAt(now);
                // c.setUpdatedAt(now);

                courseRepository.save(c);
            }
        }
    }

    /** 배열 index 안전 접근 + trim */
    private String safe(String[] row, int idx) {
        if (idx >= row.length) return null;
        String v = row[idx];
        return (v == null ? null : v.trim());
    }
}
