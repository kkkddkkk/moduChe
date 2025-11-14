// src/api/courseApi.js

import axios from "axios";
import { handleApiError } from "../component/common/Functions";
import { API_SERVER_HOST } from "../component/common/Variables";

// 모든 강좌 API 기본 prefix
const COURSE_SERVER_HOST = `${API_SERVER_HOST}/api/courses`;

/** 강좌 헤더 조회 */
export const getCourseHeader = async (courseId) => {
  try {
    const res = await axios.get(`${COURSE_SERVER_HOST}/${courseId}/header`);
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

/** 강좌 상세 조회 */
export const getCourseDescription = async (courseId) => {
  try {
    const res = await axios.get(
      `${COURSE_SERVER_HOST}/${courseId}/description`
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

/** 강좌 리스트 조회 */
export const getCourseList = async () => {
  const res = await axios.get(COURSE_SERVER_HOST);
  return res.data; // ← List<CourseListResponse>
};

/** 강좌 신규 등록 */
export const createCourse = async (payload) => {
  try {
    const res = await axios.post(COURSE_SERVER_HOST, payload);
    return res.data; // 보통 { courseId: number } 정도 리턴하도록 만들 거임
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};
