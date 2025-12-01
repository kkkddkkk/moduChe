import api from "../axiosInstance";

// 1) 회원 목록 조회
export const fetchUsers = (params) =>
    api.get("/admin/users", { params }).then((res) => res.data.data);

// 2) 회원 상세 조회
export const fetchUserDetail = (userId) =>
    api.get(`/admin/users/${userId}`).then((res) => res.data.data);

// 3) 회원 수정
export const updateUser = (userId, payload) =>
    api.put(`/admin/users/${userId}`, payload).then((res) => res.data.data);

// 4) 회원 삭제
export const deleteUser = (userId) =>
    api.delete(`/admin/users/${userId}`).then((res) => res.data.data);
