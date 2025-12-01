// src/api/courseAPI.js
import axios from "axios";
import { API_SERVER_HOST } from "../component/common/Variables";

// 백엔드 기본 주소: http://localhost:8080/api/course
const COURSE_BASE_URL = `${API_SERVER_HOST}/api/course`;

/* ----------------------------------------
 * 공통 유틸: 인증 헤더 생성
 * ------------------------------------- */
const buildAuthHeaders = (contentType) => {
  const token = localStorage.getItem("accessToken");

  const headers = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// 날짜 포맷 유틸 (YYYY-MM-DD → YYYY.MM.DD)
const formatDateDot = (iso) =>
  typeof iso === "string" ? iso.replaceAll("-", ".") : iso;

/* =======================================
 *  ✅ 강좌 조회 / 생성
 * ==================================== */

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
  const headers = buildAuthHeaders("multipart/form-data");
  const res = await axios.post(COURSE_BASE_URL, formData, { headers });
  return res.data;
};

/* =======================================
 *  ✅ 수강신청 관련 (수강생 입장)
 * ==================================== */

/** ✅ 수강신청: POST /api/course/{courseId}/enroll (JWT 필요) */
export const postCourseEnroll = async (courseId, payload) => {
  const headers = buildAuthHeaders("application/json");

  const res = await axios.post(
    `${COURSE_BASE_URL}/${courseId}/enroll`,
    payload,
    { headers }
  );

  return res.data;
};

/** ✅ 수강신청 모달용 내 정보: GET /api/course/enroll/me */
export const getEnrollProfile = async () => {
  const headers = buildAuthHeaders(); // Authorization 만

  const res = await axios.get(`${COURSE_BASE_URL}/enroll/me`, { headers });
  return res.data;
};

/**
 * ✅ 일반 회원: 내가 신청/수강 중인 강좌 목록
 *
 *  - 엔드포인트 예시: GET /api/course/me/enrollments
 *  - 백엔드 응답 예시:
 *    [
 *      {
 *        enrollmentId: 1,
 *        courseId: 18205,
 *        title: "발달장애인을 위한 생활 체육 교실",
 *        facilityName: "강남구체육센터",
 *        startDate: "2025-01-10",
 *        endDate: "2025-03-10",
 *        dayTime: "매주 화/목 19:00 ~ 20:00",
 *        status: "ONGOING" | "FINISHED"
 *      },
 *      ...
 *    ]
 *
 *  ➜ MyEnrolledCoursePage에서는 이 함수만 import 해서 사용
 */
export const getMyEnrolledCourses = async () => {
  const headers = buildAuthHeaders();

  const res = await axios.get(`${COURSE_BASE_URL}/me/enrollments`, {
    headers,
  });

  const raw = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.content)
    ? res.data.content // 만약 Page<T> 형태로 오면 content 사용
    : [];

  // 프론트에서 쓰기 좋은 형태로 매핑
  return raw.map((c) => ({
    id: c.enrollmentId, // row key
    courseId: c.courseId,
    title: c.title,
    facilityName: c.facilityName,
    period:
      c.startDate && c.endDate
        ? `${formatDateDot(c.startDate)} ~ ${formatDateDot(c.endDate)}`
        : "",
    dayTime: c.dayTime,
    // 필터용 상태값: "ongoing" / "finished" 로 통일
    status:
      c.status === "FINISHED"
        ? "finished"
        : c.status === "ONGOING"
        ? "ongoing"
        : "ongoing",
    // 필요하면 여기에 progress, firstClassDate 등 추가
  }));
};

export const fetchMyEnrolledCourses = getMyEnrolledCourses;
/* =======================================
 *  ⭐ 시설용 수강신청 관리 API (course 축)
 * ==================================== */

/** ✅ 시설 유저: 내 시설 수강신청 목록 (Page<EnrollmentForFacilityResponse>) */
export const getFacilityEnrollmentSummaries = async (page = 0, size = 10) => {
  const headers = buildAuthHeaders();

  const res = await axios.get(`${COURSE_BASE_URL}/facility/enrollments`, {
    headers,
    params: { page, size },
  });

  return res.data; // { content, totalPages, ... }
};

/** ✅ 시설 유저: 수강신청 승인 */
export const approveEnrollment = async (enrollmentId) => {
  const headers = buildAuthHeaders();

  const res = await axios.post(
    `${COURSE_BASE_URL}/enroll/${enrollmentId}/approve`,
    null,
    { headers }
  );
  return res.data;
};

/** ✅ 시설 유저: 수강신청 거절 */
export const rejectEnrollment = async (enrollmentId) => {
  const headers = buildAuthHeaders();

  const res = await axios.post(
    `${COURSE_BASE_URL}/enroll/${enrollmentId}/reject`,
    null,
    { headers }
  );
  return res.data;
};
