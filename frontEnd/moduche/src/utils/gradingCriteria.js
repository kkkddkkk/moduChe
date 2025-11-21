// 임시 등급 기준 데이터입니다.
// TODO: 실제 등급 기준표에 맞게 각 항목의 score 기준을 수정해야 합니다.
export const gradingCriteria = {
    "제자리 멀리뛰기": [
        { grade: "1등급", score: 250 }, // 250cm 이상
        { grade: "2등급", score: 230 }, // 230cm 이상
        { grade: "3등급", score: 210 }, // 210cm 이상
    ],
    윗몸일으키기: [
        { grade: "1등급", score: 60 }, // 60회 이상
        { grade: "2등급", score: 50 }, // 50회 이상
        { grade: "3등급", score: 40 }, // 40회 이상
    ],
    악력: [
        { grade: "1등급", score: 50 }, // 50kg 이상
        { grade: "2등급", score: 45 }, // 45kg 이상
        { grade: "3등급", score: 40 }, // 40kg 이상
    ],
    "앉아 윗몸 앞으로 굽히기": [
        { grade: "1등급", score: 20 }, // 20cm 이상
        { grade: "2등급", score: 15 }, // 15cm 이상
        { grade: "3등급", score: 10 }, // 10cm 이상
    ],
    "왕복 오래달리기": [
        { grade: "1등급", score: 100 }, // 100회 이상
        { grade: "2등급", score: 80 }, // 80회 이상
        { grade: "3등급", score: 60 }, // 60회 이상
    ],
    "50m 달리기": [
        // 달리기는 점수가 낮을수록 등급이 높습니다.
        { grade: "1등급", score: 7.0 }, // 7.0초 이하
        { grade: "2등급", score: 8.0 }, // 8.0초 이하
        { grade: "3등급", score: 9.0 }, // 9.0초 이하
    ],
};

// 점수가 클수록 좋은 항목에 대한 등급 계산
const getGradeForHigherIsBetter = (score, criteria) => {
    for (const threshold of criteria) {
        if (score >= threshold.score) {
            return threshold.grade;
        }
    }
    return "등급 외"; // 기준에 해당하지 않는 경우
};

// 점수가 작을수록 좋은 항목(예: 달리기)에 대한 등급 계산
const getGradeForLowerIsBetter = (score, criteria) => {
    for (const threshold of criteria) {
        if (score <= threshold.score) {
            return threshold.grade;
        }
    }
    return "등급 외";
};

export const calculateGrade = (itemName, score) => {
    const criteria = gradingCriteria[itemName];
    if (!criteria) {
        return null; // 측정 항목을 찾을 수 없는 경우
    }

    // 50m 달리기는 점수가 낮을수록 좋음
    if (itemName === "50m 달리기") {
        return getGradeForLowerIsBetter(parseFloat(score), criteria);
    }

    // 그 외 항목들은 점수가 높을수록 좋음
    return getGradeForHigherIsBetter(parseFloat(score), criteria);
};
