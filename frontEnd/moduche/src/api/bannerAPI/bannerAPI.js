import axios from "axios";
import api from "../axiosInstance";
import { API_SERVER_HOST } from "../../component/common/Variables";
import { handleApiError } from "../../component/common/Functions";

const noAuthApi = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// 배너 출력 유형 조회
export const getAllBannerTypes = async () => {
    const response = await api.get("/banner/types", {
        headers: { Authorization: undefined },
    });
    return response.data;
};

// 배너 중요도 유형 조회
export const getAllBannerPriorities = async () => {
    const response = await api.get("/banner/priorities", {
        headers: { Authorization: undefined },
    });
    return response.data;
};

// 배너 노출기간 유형 조회
export const getAllBannerDurations = async () => {
    const response = await api.get("/banner/durations", {
        headers: { Authorization: undefined },
    });
    return response.data;
};

// 사전 결제 엔티티 생성.
export const prepareBannerPayment = async (data) => {
    const response = await api.post("/payment/prepare-banner", data, {
        headers: { Authorization: undefined },
    });
    return response.data;
};

//결제 승인 처리.
export const confirmBannerPayment = async (data) => {
    const response = await noAuthApi.post("/payment/confirm-banner", data);
    return response.data;
};

//결제 승인 후 배너 신청 엔티티 생성 호출.
export const submitBannerApply = async (formData) => {
    const response = await noAuthApi.post("/banner/apply", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

//관리자 전용 전체 조회.
export const fetchBannerAppyList = async (
    page = 0,
    size = 10,
    search = ""
) => {
    try {
        const response = await api.get("/banner/apply-list", {
            params: { page, size, search },
        });
        return response.data;
    } catch (error) {
        console.error("BannerApply 조회 실패:", error);
        return false;
    }
};


//관리자 배너 승인.
export const acceptBannerApply = async (bannerApplyId) => {
    try {
        const response = await api.put(`/banner-apply/${bannerApplyId}/accept`);
        return response.data;
    } catch (error) {
        console.error("BannerApply 승인 실패:", error);
        return false;
    }
};
