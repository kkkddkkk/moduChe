// src/api/inquiryApi/inquiryApi.js
import api from "../axiosInstance";

// 문의 작성
export async function createInquiry(body) {
    const { data } = await api.post("/inquiries", body);
    return data;
}

// 전체 문의 목록 조회 (비로그인도 가능)
export async function fetchInquiries(params = {}) {
    const { page = 0, size = 10 } = params;

    const { data } = await api.get("/inquiries", {
        params: { page, size },
    });
    return data;
}

// 문의 상세 조회 (비밀글은 백엔드에서 접근 제어)
export async function fetchInquiryDetail(id) {
    const { data } = await api.get(`/inquiries/${id}`);
    return data;
}

// 문의 수정
export async function updateInquiry(id, body) {
    const { data } = await api.put(`/inquiries/${id}`, body);
    return data;
}

// 문의 삭제
export async function deleteInquiry(id) {
    const { data } = await api.delete(`/inquiries/${id}`);
    return data;
}

// -----------------------
//        관리자 API
// -----------------------

export async function fetchAdminInquiries(params = {}) {
    const { page = 0, size = 10, status } = params;
    const { data } = await api.get("/admin/inquiries", {
        params: { page, size, status },
    });
    return data;
}

export async function fetchAdminInquiryDetail(id) {
    const { data } = await api.get(`/admin/inquiries/${id}`);
    return data;
}

export async function createAnswer(inquiryId, body) {
    const { data } = await api.post(
        `/admin/inquiries/${inquiryId}/answer`,
        body
    );
    return data;
}

export async function updateAnswer(answerId, body) {
    const { data } = await api.put(`/admin/inquiries/answer/${answerId}`, body);
    return data;
}

export async function deleteAnswer(answerId) {
    const { data } = await api.delete(`/admin/inquiries/answer/${answerId}`);
    return data;
}
