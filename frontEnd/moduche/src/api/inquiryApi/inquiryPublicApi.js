import api from "../axiosInstance";

// 전체 문의 목록 (비로그인도 가능)
export async function fetchInquiries(params = {}) {
    const { page = 0, size = 10 } = params;
    const { data } = await api.get("/inquiries", {
        params: { page, size },
    });
    return data;
}

// 상세 조회
export async function fetchInquiryDetail(id) {
    const { data } = await api.get(`/inquiries/${id}`);
    return data;
}
