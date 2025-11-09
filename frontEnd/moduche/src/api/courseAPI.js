import axios from "axios";
import { handleApiError } from "../component/common/Functions";
import { API_SERVER_HOST } from "../component/common/Variables";

const COURSE_SERVER_HOST = `${API_SERVER_HOST}/api/courses`;

/** 강좌 헤더 조회 */
export const getCourseHeader = async (courseId) => {
  try {
    const res = await axios.get(`${COURSE_SERVER_HOST}/${courseId}/header`);
    return res.data; // CourseHeaderResponse
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
    return res.data; // { title, description, tags, addressLine }
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};
