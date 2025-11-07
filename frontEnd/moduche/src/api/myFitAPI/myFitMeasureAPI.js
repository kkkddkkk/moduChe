import api from "../axiosInstance";

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
    const response = await api.post("/myfit/measure", measureData);
    return response.data;
};
