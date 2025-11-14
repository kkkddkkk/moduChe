import axios from "axios";
import { API_SERVER_HOST, AUTH } from "../../component/common/Variables";
// ↑ 경로는 네 프로젝트 구조에 맞게 수정

// -------------------------------
// 1) axios 인스턴스 생성
// -------------------------------
const http = axios.create({
    baseURL: API_SERVER_HOST, // http://localhost:8080
    withCredentials: false,
});

// JWT 자동 포함
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH.TOKEN_KEY);
        console.log(">>> access_token:", token);
        if (token) {
            config.headers[AUTH.HEADER_KEY] = AUTH.SCHEME + token;
            console.log(">>> Authorization:", config.headers[AUTH.HEADER_KEY]);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------------------
// 2) 관리자 API
// -------------------------------

// 관리자 목록 조회
export async function fetchAdmins(params = {}) {
    const { data } = await http.get("/api/admins", {
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

// 관리자 상태 변경
export async function patchAdmin(id, { status }) {
    const { data } = await http.patch(`/api/admins/${id}`, null, {
        params: { status },
    });
    return data;
}

// 관리자 삭제
export async function deleteAdmin(id) {
    await http.delete(`/api/admins/${id}`);
}

// 관리자 생성
export async function createAdmin(body) {
    const { data } = await http.post("/api/admins", body);
    return data;
}
