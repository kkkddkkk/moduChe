import api from "../axiosInstance";

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
    const { data } = await api.post(`/admin/inquiries/${inquiryId}/answer`, body);
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
