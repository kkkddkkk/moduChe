// src/api/courseAPI.js

import axios from "axios";
import { API_SERVER_HOST } from "../component/common/Variables";

// 백엔드 기본 주소: http://localhost:8080/api/course
const COURSE_BASE_URL = `${API_SERVER_HOST}/api/course`;

/** ✅ 강좌 리스트 조회: GET /api/course */
export const getCourseList = async () => {
  const res = await axios.get(COURSE_BASE_URL);
  return res.data;
};

/** ✅ 강좌 헤더 조회: GET /api/course/{id}/header */
export const getCourseHeader = async (courseId) => {
  const res = await axios.get(`${COURSE_BASE_URL}/${courseId}/header`);
  return res.data;
};

/** ✅ 강좌 상세 조회: GET /api/course/{id}/description */
export const getCourseDescription = async (courseId) => {
  const res = await axios.get(`${COURSE_BASE_URL}/${courseId}/description`);
  return res.data;
};

/** ✅ 강좌 신규 등록: POST /api/course  (JWT 직접 붙이기) */
export const createCourse = async (formData) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.post(COURSE_BASE_URL, formData, {
    headers,
  });

  return res.data;
};
