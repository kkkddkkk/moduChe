import communityHttp from "../communityAPI/communityHttp";

// 📋 관리자 목록 조회 (Spring Page)
export async function fetchAdmins(params = {}) {
    const { data } = await communityHttp.get("/admins", {
        params: {
            page: params.page ?? 0, // 0-base
            size: params.size ?? 5,
            sort: params.sort ?? "createdAt,desc",
            q: params.q || undefined,
            status: params.status || undefined,
            role: params.role || undefined, // 추가
            createdFrom: params.createdFrom,
            createdTo: params.createdTo,
        },
    });
    return data;
}

// 🔄 관리자 상태 변경 (활성/중지)
export async function patchAdmin(id, { status }) {
    const { data } = await communityHttp.patch(`/admins/${id}`, null, {
        params: { status }, // ex) { status: "ACTIVE" }
    });
    return data;
}

// 🗑 관리자 삭제
export async function deleteAdmin(id) {
    await communityHttp.delete(`/admins/${id}`);
}

// ➕ 관리자 생성 (선택)
export async function createAdmin(body) {
    // body 예: { name, email, username, password, roleId, phone }
    const { data } = await communityHttp.post("/admins", body);
    return data;
}
