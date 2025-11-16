package com.example.moduche.global.init;

import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import com.example.moduche.domain.myFit.repository.MyFitMeasureResultRepository;
import com.example.moduche.domain.myFit.repository.MyFitMvmContentRepository;
import com.example.moduche.domain.myFit.repository.MyFitPrescriptionRepository;
import com.example.moduche.domain.myFit.repository.MyFitRecommendRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
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

@Slf4j
@Profile("dev")
@Component
@RequiredArgsConstructor
public class MyFitDataInitializer {

    private final MyFitMeasureResultRepository measureResultRepository;
    private final MyFitPrescriptionRepository prescriptionRepository;
    private final MyFitRecommendRepository recommendRepository;
    private final MyFitMvmContentRepository mvmContentRepository;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        try {
            // DB 비어있는 경우만 실행
            if (prescriptionRepository.count() == 0 && recommendRepository.count() == 0) {
                log.info("🚀 MyFit 초기 데이터가 없어 로드 시작");
                loadPrescriptionData();
                loadRecommendationData();
                log.info("🎉 MyFit 초기 데이터 로드 완료");
            } else {
                log.info("🟡 MyFit 데이터가 이미 존재하여 로드를 건너뜁니다.");
            }
        } catch (Exception e) {
            log.error("❌ MyFit 초기 데이터 로드 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    /** 1️⃣ 운동 처방 로드 */
    private void loadPrescriptionData() throws Exception {
        log.info("📥 운동 처방 JSON 로드 중...");

        ClassPathResource resource = new ClassPathResource(
                "data/KS_DSPSN_FTNESS_MESURE_ACCTO_MVM_PRSCRPTN_LIST_202504.json"
        );
        InputStream inputStream = resource.getInputStream();

        List<MyFitPrescriptionJson> dataList = objectMapper.readValue(
                inputStream, new TypeReference<>() {}
        );

        for (MyFitPrescriptionJson data : dataList) {
            MyFitMeasureResult result = new MyFitMeasureResult();
            result.setMeasureDate(LocalDate.now());
            result.setItemName(data.getItemName());
            result.setScore(data.getScore());
            result.setUnit(data.getUnit());
            result.setGrade(data.getGrade());
            result.setPrescriptionContent(data.getPrescriptionContent());
            measureResultRepository.save(result);

            MyFitPrescription prescription = new MyFitPrescription();
            prescription.setSexdstnFlagCd(data.getSexdstnFlagCd());
            prescription.setTroblTyNm(data.getTroblTyNm());
            prescription.setTroblDetailNm(data.getTroblDetailNm());
            prescription.setPrescriptionContent(data.getPrescriptionContent());
            prescription.setMeasureResult(result);

            prescriptionRepository.save(prescription);
        }

        log.info("📌 처방 데이터 {}건 저장 완료", dataList.size());
    }

    /** 2️⃣ 추천 운동 로드 */
    private void loadRecommendationData() throws Exception {
        log.info("📥 추천 운동 JSON 로드 중...");

        ClassPathResource resource = new ClassPathResource(
                "data/KS_DSPSN_FTNESS_MESURE_ACCTO_RECOMEND_MVM_INFO_202507.json"
        );
        InputStream inputStream = resource.getInputStream();

        List<MyFitRecommendJson> dataList = objectMapper.readValue(
                inputStream, new TypeReference<>() {}
        );

        for (MyFitRecommendJson data : dataList) {
            MyFitRecommend recommend = new MyFitRecommend();
            recommend.setDisabilityType(data.getDisabilityType());
            recommend.setAgeFlagNm(data.getAgeFlagNm());
            recommend.setRecommendMvmNm(data.getRecommendMvmNm());
            recommend.setRank(data.getRank());
            recommend.setIntensity(data.getIntensity());
            recommend.setFrequency(data.getFrequency());
            recommend.setDuration(data.getDuration());
            recommendRepository.save(recommend);

            if (data.getMvmList() != null) {
                for (MyFitMvmContentJson c : data.getMvmList()) {
                    MyFitMvmContent content = new MyFitMvmContent();
                    content.setRecommendMvmNm(c.getRecommendMvmNm());
                    content.setSportsStepNm(c.getSportsStepNm());
                    content.setVideoUrl(c.getVideoUrl());
                    content.setRecommend(recommend);
                    mvmContentRepository.save(content);
                }
            }
        }

        log.info("📌 추천 운동 데이터 {}건 저장 완료", dataList.size());
    }

    /** JSON 매핑 DTO */
    @Getter
    @Setter
    private static class MyFitPrescriptionJson {
        @JsonProperty("SEXDSTN_FLAG_CD")
        private String sexdstnFlagCd;

        @JsonProperty("TROBL_TY_NM")
        private String troblTyNm;

        @JsonProperty("TROBL_DETAIL_NM")
        private String troblDetailNm;

        @JsonProperty("MVM_PRSCRPTN_CN")
        private String prescriptionContent;

        @JsonProperty("MESURE_ITEM_NM")
        private String itemName;

        @JsonProperty("MESURE_SCORE")
        private Double score;

        @JsonProperty("MESURE_UNIT_NM")
        private String unit;

        @JsonProperty("MESURE_GRAD_NM")
        private String grade;
    }

    @Getter
    @Setter
    private static class MyFitRecommendJson {
        @JsonProperty("DSPSN_TY_NM")
        private String disabilityType;

        @JsonProperty("AGRDE_FLAG_NM")
        private String ageFlagNm;

        @JsonProperty("RECOMEND_MVM_NM")
        private String recommendMvmNm;

        @JsonProperty("FLAG_ACCTO_RECOMEND_MVM_RANK_CO")
        private Integer rank;

        @JsonProperty("MVM_INTEN_FLAG_NM")
        private String intensity;

        @JsonProperty("MVM_FRQNC_FLAG_NM")
        private String frequency;

        @JsonProperty("MVM_TIME_FLAG_NM")
        private String duration;

        @JsonProperty("MVM_LIST")
        private List<MyFitMvmContentJson> mvmList;
    }

    @Getter
    @Setter
    private static class MyFitMvmContentJson {
        @JsonProperty("RECOMEND_MVM_NM")
        private String recommendMvmNm;

        @JsonProperty("SPORTS_STEP_NM")
        private String sportsStepNm;

        @JsonProperty("MVM_VIDEO_URL")
        private String videoUrl;
    }
}
