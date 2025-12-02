import api from "../axiosInstance";

/** 📌 요약 정보 API */
export const getDashboardSummary = async () => {
    const res = await api.get("/admin/dashboard/summary");
    return res.data; // DashboardSummaryDto
};

/** 📌 최근 7일 트렌드 */
export const getDashboardTrend = async () => {
    const res = await api.get("/admin/dashboard/trend");
    return res.data; // DashboardTrendDto
};
