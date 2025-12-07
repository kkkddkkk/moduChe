import api from "../axiosInstance";

// recommendId로 단일 추천 정보 조회
export const getRecommendById = async (recommendId) => {
    const response = await api.get(`/myfit/recommend/${recommendId}`);
    return response.data;
};

// 조건에 따른 추천 목록 조회
export const getRecommendationsByCriteria = async (criteria) => {
    const response = await api.get("/myfit/recommend/search", {
        params: criteria,
    });
    return response.data;
};

// recommendId로 운동 단계별 안내 조회
export const getRecommendContentsById = async (recommendId) => {
    const response = await api.get(`/myfit/recommend/${recommendId}/contents`);
    return response.data;
};
