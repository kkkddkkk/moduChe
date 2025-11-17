import axios from 'axios';
import { isLoggedIn } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키/세션 인증시 true 로 사용하세요
});

// 요청 인터셉터 / (예) 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const apiNoInterceptor = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키/세션 인증 필요시
});

// 응답 인터셉터 / (예) 에러 핸들링
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isTokenError = !isLoggedIn();
      // error.response?.status === 401 || error.response?.status === 403;

    // 401이면서 재시도 안 한 요청만
    if (isTokenError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 accessToken 재발급
        const res = await apiNoInterceptor.post('/reissue');
        const newAccessToken = res.data.data; // 백엔드에서 accessToken 반환

        // localStorage 갱신
        localStorage.setItem('accessToken', newAccessToken);

        // 헤더에 새 토큰 적용 후 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // refreshToken도 만료됐거나 에러 발생
        console.log('토큰 재발급 실패', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('name');

        // 로그아웃 처리 등
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
