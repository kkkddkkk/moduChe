// src/api/searchAPI.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// 🔍 공통 검색 (인터셉터/토큰 X)
export const searchBoard = (params) => {
  return axios.post(`${BASE_URL}/search`, params, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: false, // 검색은 굳이 쿠키/세션 안 써도 됨
  });
};

// COURSE 전용
export const searchCourses = (options) =>
  searchBoard({ boardType: "COURSE", ...options });

// COMMUNITY 전용
export const searchCommunities = (options) =>
  searchBoard({ boardType: "COMMUNITY", ...options });
