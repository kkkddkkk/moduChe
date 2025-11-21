import api from "../axiosInstance";

// recommendId로 단일 추천 정보 조회
export const getRecommendById = async (recommendId) => {
    const response = await api.get(`/myfit/recommend/${recommendId}`);
    return response.data;
};