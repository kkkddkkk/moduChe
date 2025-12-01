import api from "../axiosInstance";
import { AUTH } from "../../component/common/Variables";

/**
 * 신고 생성 (댓글/게시글/사용자 공통)
 */
export const createReport = async ({
    targetType,
    targetId,
    reasonCode,
    reasonDetail = "",
}) => {
    try {
        const resp = await api.post(
            "/reports",
            { targetType, targetId, reasonCode, reasonDetail },
            {
                headers: {
                    Authorization: `Bearer ${AUTH.getAccessToken()}`,
                },
            }
        );
        return resp.data;
    } catch (err) {
        console.error("신고 생성 실패:", err);
        throw err;
    }
};

/**
 * 신고 목록 조회 (관리자)
 */
export const fetchReports = async (page = 0, size = 1000) => {
    try {
        const resp = await api.get("/reports", {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${AUTH.getAccessToken()}`,
            },
        });
        return resp.data;
    } catch (err) {
        console.error("신고 목록 조회 실패:", err);
        throw err;
    }
};

/**
 * 신고 상세 조회 (관리자)
 */
export const fetchReportDetail = async (reportId) => {
    try {
        const resp = await api.get(`/reports/${reportId}`, {
            headers: {
                Authorization: `Bearer ${AUTH.getAccessToken()}`,
            },
        });
        return resp.data;
    } catch (err) {
        console.error("신고 상세 조회 실패:", err);
        throw err;
    }
};

/**
 * 신고 상태 변경 (관리자)
 */
export const updateReportStatus = async (reportId, newStatus) => {
    try {
        const resp = await api.post(
            `/reports/${reportId}/status`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${AUTH.getAccessToken()}`,
                },
            }
        );
        return resp.data;
    } catch (err) {
        console.error("신고 상태 변경 실패:", err);
        throw err;
    }
};
