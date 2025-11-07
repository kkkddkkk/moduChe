import api from "../axiosInstance";

// 처방 생성
export const generatePrescription = async (measureData) => {
    const response = await api.post("/myfit/prescription", measureData);
    return response.data;
};

// 사용자별 처방 조회
export const getPrescriptionByUser = async (userId) => {
    const response = await api.get(`/myfit/prescription/${userId}`);
    return response.data;
};
