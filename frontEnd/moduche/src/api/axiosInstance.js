import axios from "axios";
import { isLoggedIn } from "../utils/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔹 어떤 URL이 "공개 엔드포인트" 인지 체크하는 헬퍼
const isPublicApi = (url = "") => {
  // baseURL 뒤의 path만 들어온다고 가정: "/search", "/course/header/123" 이런 식
  return (
    url.startsWith("/search") || // 🔥 퀵 서치
    url.startsWith("/main") || // 메인 페이지용
    (url.startsWith("/course") && url.includes("/list")) // 필요하면 조절
    // 여기에 더 추가 가능
  );
};

// ✅ 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const url = config.url || "";

    // 🔥 공개 API면 토큰 아예 붙이지 않음
    if (isPublicApi(url)) {
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
      return config;
    }

    // 그 외(마이페이지, 수강신청 등)는 기존대로 토큰 붙이기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== 아래는 네가 이미 수정해둔 부분 유지 ======================
const apiNoInterceptor = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!error.response) return Promise.reject(error);

    if (originalRequest.url?.includes("/reissue")) {
      return Promise.reject(error);
    }

    // 🔥 로그인 안 했으면 토큰 재발급 시도 안 함
    if (!isLoggedIn()) {
      return Promise.reject(error);
    }

    if (!(status === 401 || status === 403) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await apiNoInterceptor.post("/reissue");
      const newAccessToken = res.data.data;

      localStorage.setItem("accessToken", newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      console.log("토큰 재발급 실패", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("name");
      return Promise.reject(err);
    }
  }
);

export default api;
