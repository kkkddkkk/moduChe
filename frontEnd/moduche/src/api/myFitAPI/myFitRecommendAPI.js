import api from "../axiosInstance";

// 특정 장애 유형 기준 추천 운동 리스트
export const getRecommendationsByDisability = async (disabilityType) => {
    const response = await api.get(
        `/myfit/recommend/disability?disability=${disabilityType}`
    );
    return response.data;
};

// 사용자별 추천 운동 조회
export const getRecommendationsByUser = async (userId) => {
    const response = await api.get(`/myfit/recommend/user/${userId}`);
    return response.data;
};

// 추천 운동 상세 정보
export const getRecommendationDetail = async (recommendId) => {
    const response = await api.get(`/myfit/recommend/${recommendId}`);
    return response.data;
};
