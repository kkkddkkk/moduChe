import api from "../axiosInstance";
import { calculateGrade } from "../../utils/gradingCriteria";

// 전체 측정 결과 조회
export const getAllMeasureResults = async () => {
    const response = await api.get("/myfit/measure");
    return response.data;
};

// 사용자별 측정 결과 조회
export const getMeasureResultById = async (resultId) => {
    const response = await api.get(`/myfit/measure/${resultId}`);
    return response.data;
};

// 새로운 측정 결과 등록
export const saveMeasureResult = async (measureData) => {
    // API로 보내기 전, 각 측정 결과에 등급(grade)을 계산하여 추가
    const updatedResults = measureData.results.map(result => {
        const grade = calculateGrade(result.itemName, result.score);
        return {
            ...result,
            grade: grade, // 계산된 등급 추가
        };
    });

    const updatedMeasureData = {
        ...measureData,
        results: updatedResults,
    };

    const response = await api.post("/myfit/measure", updatedMeasureData);
    return response.data;
};
