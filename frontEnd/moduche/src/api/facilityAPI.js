import axios from "axios";
import { API_SERVER_HOST } from "../component/common/Variables";

const FACILITY_SERVER_HOST = `${API_SERVER_HOST}/api/facility`;

// JWT 포함해서 내 시설 정보 조회
export const fetchMyFacility = async () => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await axios.get(`${FACILITY_SERVER_HOST}/me`, { headers });
  return res.data;
};
