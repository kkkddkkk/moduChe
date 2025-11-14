package com.example.moduche.global.init;

import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import com.example.moduche.domain.myFit.repository.MyFitMeasureRepository;
import com.example.moduche.domain.myFit.repository.MyFitMeasureResultRepository;
import com.example.moduche.domain.myFit.repository.MyFitMvmContentRepository;
import com.example.moduche.domain.myFit.repository.MyFitPrescriptionRepository;
import com.example.moduche.domain.myFit.repository.MyFitRecommendRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

/**
 * JSON 파일을 읽어와 MyFit 관련 데이터를 DB에 초기 로드하는 클래스
 */
@Slf4j
@Profile("dev")
@Component
@RequiredArgsConstructor
public class MyFitDataInitializer {

    private final MyFitMeasureRepository measureRepository;
    private final MyFitMeasureResultRepository measureResultRepository;
    private final MyFitPrescriptionRepository prescriptionRepository;
    private final MyFitRecommendRepository recommendRepository;
    private final MyFitMvmContentRepository mvmContentRepository; // 있으면 좋음, 없어도 주석 처리 가능
    private final ObjectMapper objectMapper;

    /**
     * 애플리케이션 시작 시 한 번만 실행됨
     */
    @PostConstruct
    public void init() {
        try {
            loadPrescriptionData();
            loadRecommendationData();
        } catch (Exception e) {
            log.error("❌ MyFit 초기 데이터 로드 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    /**
     * 1️⃣ 운동 처방 JSON 로드 → MyFitPrescription, MyFitMeasureResult 생성
     */
    private void loadPrescriptionData() throws Exception {
        log.info("📥 운동 처방 데이터 로드 시작...");

        // resources/data/ 폴더의 파일을 읽음
        ClassPathResource resource = new ClassPathResource(
                "data/KS_DSPSN_FTNESS_MESURE_ACCTO_MVM_PRSCRPTN_LIST_202504.json"
        );
        InputStream inputStream = resource.getInputStream();

        // JSON을 List<Map> 형태로 파싱
        List<MyFitPrescriptionJson> dataList = objectMapper.readValue(
                inputStream, new TypeReference<>() {}
        );

        for (MyFitPrescriptionJson data : dataList) {
            // 1. 측정 결과 생성
            MyFitMeasureResult result = new MyFitMeasureResult();
            result.setMeasureDate(LocalDate.now());
            result.setItemName(data.getItemName());
            result.setScore(data.getScore());
            result.setUnit(data.getUnit());
            result.setGrade(data.getGrade());
            result.setPrescriptionContent(data.getPrescriptionContent());
            measureResultRepository.save(result);

            // 2. 처방 생성
            MyFitPrescription prescription = new MyFitPrescription();
            prescription.setSexdstnFlagCd(data.getSexdstnFlagCd());
            prescription.setTroblTyNm(data.getTroblTyNm());
            prescription.setTroblDetailNm(data.getTroblDetailNm());
            prescription.setPrescriptionContent(data.getPrescriptionContent());
            prescription.setMeasureResult(result);
            prescriptionRepository.save(prescription);
        }

        log.info("✅ 운동 처방 데이터 {}건 로드 완료", dataList.size());
    }

    /**
     * 2️⃣ 추천 운동 JSON 로드 → MyFitRecommend, MyFitMvmContent 생성
     */
    private void loadRecommendationData() throws Exception {
        log.info("📥 추천 운동 데이터 로드 시작...");

        ClassPathResource resource = new ClassPathResource(
                "data/KS_DSPSN_FTNESS_MESURE_ACCTO_RECOMEND_MVM_INFO_202507.json"
        );
        InputStream inputStream = resource.getInputStream();

        List<MyFitRecommendJson> dataList = objectMapper.readValue(
                inputStream, new TypeReference<>() {}
        );

        for (MyFitRecommendJson data : dataList) {
            // 1. 추천 생성
            MyFitRecommend recommend = new MyFitRecommend();
            recommend.setDisabilityType(data.getDisabilityType());
            recommend.setAgeFlagNm(data.getAgeFlagNm());
            recommend.setRecommendMvmNm(data.getRecommendMvmNm());
            recommend.setRank(data.getRank());
            recommend.setIntensity(data.getIntensity());
            recommend.setFrequency(data.getFrequency());
            recommend.setDuration(data.getDuration());
            recommendRepository.save(recommend);

            // 2. 관련 운동 콘텐츠 추가 (있을 경우)
            if (data.getMvmList() != null && !data.getMvmList().isEmpty()) {
                for (MyFitMvmContentJson contentData : data.getMvmList()) {
                    MyFitMvmContent content = new MyFitMvmContent();
                    content.setRecommendMvmNm(contentData.getRecommendMvmNm());
                    content.setSportsStepNm(contentData.getSportsStepNm());
                    content.setVideoUrl(contentData.getVideoUrl());
                    content.setRecommend(recommend);
                    mvmContentRepository.save(content);
                }
            }
        }

        log.info("✅ 추천 운동 데이터 {}건 로드 완료", dataList.size());
    }

    /**
     * ✅ JSON 파일 매핑용 내부 클래스 (필요한 필드만)
     */
    @Getter
    @Setter
    private static class MyFitPrescriptionJson {
        private String sexdstnFlagCd;
        private String troblTyNm;
        private String troblDetailNm;
        private String prescriptionContent;
        private String itemName;
        private Double score;
        private String unit;
        private String grade;
    }

    @Getter
    @Setter
    private static class MyFitRecommendJson {
        private String disabilityType;
        private String ageFlagNm;
        private String recommendMvmNm;
        private Integer rank;
        private String intensity;
        private String frequency;
        private String duration;
        private List<MyFitMvmContentJson> mvmList;
    }

    @Getter
    @Setter
    private static class MyFitMvmContentJson {
        private String recommendMvmNm;
        private String sportsStepNm;
        private String videoUrl;
    }
}
