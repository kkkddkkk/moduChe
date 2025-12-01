import api from "../axiosInstance";

// -----------------------------------------
// 관리자 목록 조회
// -----------------------------------------
export async function fetchAdmins(params = {}) {
    const { data } = await api.get("/admins", {
        params: {
            page: params.page ?? 0,
            size: params.size ?? 5,
            sort: params.sort ?? "createdAt,desc",
            q: params.q || undefined,
            status: params.status || undefined,
            role: params.role || undefined,
            createdFrom: params.createdFrom,
            createdTo: params.createdTo,
        },
    });
    return data;
}

// -----------------------------------------
// 관리자 상태 변경
// -----------------------------------------
export async function patchAdmin(id, { status }) {
    const { data } = await api.patch(`/admins/${id}`, null, {
        params: { status },
    });
    return data;
}

// -----------------------------------------
// 관리자 삭제
// -----------------------------------------
export async function deleteAdmin(id) {
    await api.delete(`/admins/${id}`);
}

// -----------------------------------------
// 관리자 생성
// -----------------------------------------
export async function createAdmin(body) {
    const { data } = await api.post("/admins", body);
    return data;
}
