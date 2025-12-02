import api from "../axiosInstance";

// 내 문의
export async function fetchMyInquiries(params = {}) {
    const { page = 0, size = 10 } = params;
    const { data } = await api.get("/inquiries/my", {
        params: { page, size },
    });
    return data;
}

// 작성
export async function createInquiry(body) {
    const { data } = await api.post("/inquiries", body);
    return data;
}

// 수정
export async function updateInquiry(id, body) {
    const { data } = await api.put(`/inquiries/${id}`, body);
    return data;
}

// 삭제
export async function deleteInquiry(id) {
    const { data } = await api.delete(`/inquiries/${id}`);
    return data;
}
