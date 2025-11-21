import axios from "axios";

const communityHttp = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // 쿠키 기반 인증 시 필요하니 추후 TRUE로 바꾸세요(과거의 고은설이 미래의 고은설에게).
});

// 요청에 토큰 첨부 (작성자: 고은설).
communityHttp.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default communityHttp;
