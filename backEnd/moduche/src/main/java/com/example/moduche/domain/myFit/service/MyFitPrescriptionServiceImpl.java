package com.example.moduche.domain.myFit.service;

import com.example.moduche.domain.login.AccessibilityProfile;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.repository.AccessibilityProfileRepository;
import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMeasure;
import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import com.example.moduche.domain.myFit.repository.MyFitPrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MyFitPrescriptionServiceImpl implements MyFitPrescriptionService {

    private static final Logger logger = LoggerFactory.getLogger(MyFitPrescriptionServiceImpl.class);

    private final MyFitPrescriptionRepository myFitPrescriptionRepository;
    private final AccessibilityProfileRepository accessibilityProfileRepository;

    @Override
    public void createPrescriptionFromMeasure(MyFitMeasure measure) {
        User user = measure.getUser();
        if (user == null) {
            logger.warn("MyFitMeasure with id {} has no associated user. Skipping prescription creation.", measure.getMeasureId());
            return;
        }

        logger.info("Creating prescription for measureId: {}, userId: {}", measure.getMeasureId(), user.getUserId());
        Optional<AccessibilityProfile> accessibilityProfileOptional = accessibilityProfileRepository.findByUsername(user.getUsername());

        if (accessibilityProfileOptional.isPresent()) {
            AccessibilityProfile accessibilityProfile = accessibilityProfileOptional.get();
            logger.info("Found AccessibilityProfile for userId: {}", user.getUserId());

            for (MyFitMeasureResult result : measure.getResults()) {
                // 1. 처방(Prescription) 객체 생성 및 기본 정보 설정
                MyFitPrescription prescription = new MyFitPrescription();
                prescription.setSexdstnFlagCd(accessibilityProfile.getGender());
                prescription.setTroblTyNm(accessibilityProfile.getDisability().getDisabilityCode());
                prescription.setTroblDetailNm(accessibilityProfile.getDisabilityGrade());
                prescription.setMeasureResult(result);

                // 2. 측정 결과에 따른 처방 내용 생성 (Placeholder Logic)
                String jsonContent = String.format(
                    "{ \"pre_exercise\": [ { \"name\": \"워밍업 스트레칭\", \"duration\": \"10분\" } ], " +
                    "\"main_exercise\": [ { \"name\": \"%s 기반 본운동\", \"duration\": \"30분\", \"intensity\": \"중\" } ], " +
                    "\"cool_down\": [ { \"name\": \"정리 운동\", \"duration\": \"10분\" } ] }",
                    result.getItemName()
                );
                prescription.setPrescriptionContent(jsonContent);

                // 3. 처방에 따른 추천(Recommend) 객체 생성
                MyFitRecommend recommend = new MyFitRecommend();
                recommend.setTroblTyNm(accessibilityProfile.getDisability().getDisabilityCode()); // 장애 유형 설정
                recommend.setAgrdeFlagNm(String.valueOf(measure.getMeasureAge())); // 측정 당시 연령 설정
                
                // 등급(grade) 문자열에서 숫자만 추출하여 rank로 설정 (예: "1등급" -> 1)
                try {
                    int rank = Integer.parseInt(result.getGrade().replaceAll("[^0-9]", ""));
                    recommend.setRank(rank);
                } catch (NumberFormatException | NullPointerException e) {
                    logger.warn("Could not parse rank from grade: '{}'. Setting rank to null.", result.getGrade(), e);
                    recommend.setRank(null);
                }

                // TODO: 추천 운동명, 강도 등은 임시 데이터이며 추후 로직 구현 필요
                recommend.setRecommendMvmNm("가벼운 조깅");
                recommend.setIntensity("하");
                recommend.setFrequency("주 5회");
                recommend.setDuration("30분");

                // 4. 처방에 연결될 운동 콘텐츠(MvmContent) 생성 (임시 데이터)
                MyFitMvmContent mvmContent = new MyFitMvmContent();
                mvmContent.setRecommendMvmNm(recommend.getRecommendMvmNm());
                mvmContent.setSportsStepNm("1단계 - 준비운동");
                mvmContent.setVideoUrl("https://www.youtube.com/watch?v=example");
                
                // 5. 연관관계 설정
                // MyFitRecommend <-> MyFitMvmContent
                mvmContent.setRecommend(recommend);
                recommend.getContents().add(mvmContent);

                // MyFitPrescription <-> MyFitRecommend
                recommend.setPrescription(prescription);
                prescription.getRecommends().add(recommend);

                // 6. 처방 저장 (연관된 Recommend, MvmContent는 Cascade 설정에 의해 함께 저장됨)
                if (!prescription.getRecommends().isEmpty()) {
                    MyFitRecommend firstRecommend = prescription.getRecommends().get(0);
                }

                myFitPrescriptionRepository.save(prescription);
            }
        } else {
            logger.error("Critical error: AccessibilityProfile not found for userId: {}. Prescription creation cannot proceed.", user.getUserId());
            throw new RuntimeException("AccessibilityProfile not found for userId: " + user.getUserId());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyFitPrescriptionResponseDTO> getPrescriptionsByUserId(Long userId) {
        logger.info("Fetching prescriptions for userId: {}", userId);
        List<MyFitPrescription> prescriptions = myFitPrescriptionRepository.findPrescriptionsByUserId(userId);
        logger.info("Found {} prescriptions for userId: {}", prescriptions.size(), userId);
        return prescriptions.stream()
                .map(MyFitPrescriptionResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
