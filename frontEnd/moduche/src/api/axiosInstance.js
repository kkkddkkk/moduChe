import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // 쿠키/세션 인증시 true 로 사용하세요
});

// 요청 인터셉터 / (예) 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 / (예) 에러 핸들링
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
