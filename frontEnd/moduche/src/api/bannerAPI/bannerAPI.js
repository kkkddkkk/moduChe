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
export const fetchBannerAppyList = async ({ page, size, search, type }) => {
    try {
        const response = await api.get("/banner/apply-list", {
            params: {
                page,
                size,
                search,
                type,
            },
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

//관리자 배너 거절.
export const declineBannerApply = async (bannerApplyId, rejectReason) => {
    try {
        const response = await api.put(
            `/banner-apply/${bannerApplyId}/decline`,
            {},
            {
                params: { rejectReason },
            }
        );
        return response.data;
    } catch (error) {
        console.error("BannerApply 거절 실패:", error);
        throw error;
    }
};

//관리자 출력 중 배너 조회.
export const fetchBannerOnList = async ({ page, size, type, status, search }) => {
    const response = await api.get("/banner/on-list", {
        params: { page, size, type, status, search },
    });
    return response.data;
};

//관리자 출력 중 배너 강제 종료 처리.
export const expireBanner = async (bannerId) => {
    const response = await api.put(`/banner/${bannerId}/expire`);
    return response.data;
};

//가점 상위 3개 배너 조회(수 미달시 기본 배너 출력).
export const fetchMainBanners = async () => {
    try {
        const response = await api.get(`/banner/show-main`);
        return response.data;
    } catch (error) {
        console.error("MainBanner 조회 실패:", error);
        return false;
    }
};

export const fetchHeaderBanner = async () => {
    try {
        const response = await api.get(`/banner/show-header`);
        return response.data;
    } catch (error) {
        console.error("sideBanner 조회 실패:", error);
        return false;
    }
};

export const fetchSideBanner = async () => {
    try {
        const response = await api.get(`/banner/show-side`);
        return response.data;
    } catch (error) {
        console.error("headerBanner 조회 실패:", error);
        return false;
    }
};

export const getGuestBannerList = async (contact, password) => {
    try {
        const response = await api.post(`/banner/guest-list`, {
            contact,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("비회원 배너 신청내역 조회 실패:", error);
        return false;
    }
};

export const getMemberBannerList = async () => {
    try {
        const response = await api.get("/banner/member-list");
        return response.data;
    } catch (error) {
        console.error("회원 배너 신청내역 조회 실패:", error);
        return false;
    }
};
