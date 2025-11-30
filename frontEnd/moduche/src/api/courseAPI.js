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

/** ✅ 수강신청: POST /api/course/{courseId}/enroll (JWT 필요) */
export const postCourseEnroll = async (courseId, payload) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.post(
    `${COURSE_BASE_URL}/${courseId}/enroll`,
    payload,
    { headers }
  );

  return res.data;
};

/** ✅ 수강신청 모달용 내 정보: GET /api/course/enroll/me */
export const getEnrollProfile = async () => {
  const token = localStorage.getItem("accessToken");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.get(`${COURSE_BASE_URL}/enroll/me`, { headers });
  return res.data;
};

/* ================================
 *  ⭐ 시설용 수강신청 관리 API
 * ================================ */

/** ✅ 시설 유저: 내 시설의 승인대기 신청 목록 (페이지네이션) */
export const getFacilityEnrollments = async (page = 0, size = 10) => {
  const token = localStorage.getItem("accessToken");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.get(`${COURSE_BASE_URL}/facility/enrollments`, {
    headers,
    params: { page, size },
  });

  // 백엔드가 Page<EnrollmentForFacilityResponse> 를 내려주니까,
  // res.data = { content, totalElements, totalPages, ... } 형태
  return res.data;
};

/** ✅ 시설 유저: 수강신청 승인 */
export const approveEnrollment = async (enrollmentId) => {
  const token = localStorage.getItem("accessToken");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.post(
    `${COURSE_BASE_URL}/enroll/${enrollmentId}/approve`,
    null,
    { headers }
  );

  return res.data;
};

/** ✅ 시설 유저: 수강신청 거절 */
export const rejectEnrollment = async (enrollmentId) => {
  const token = localStorage.getItem("accessToken");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios.post(
    `${COURSE_BASE_URL}/enroll/${enrollmentId}/reject`,
    null,
    { headers }
  );

  return res.data;
};
