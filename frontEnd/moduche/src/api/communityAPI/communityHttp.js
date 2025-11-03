import axios from "axios";
import API_SERVER_HOST from "./communityServerHost";

const communityHttp = axios.create({
  baseURL: `${API_SERVER_HOST}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // 쿠키 기반 인증 시 필요하니 추후 TRUE로 바꾸세요(과거의 고은설이 미래의 고은설에게).
});

export default communityHttp;