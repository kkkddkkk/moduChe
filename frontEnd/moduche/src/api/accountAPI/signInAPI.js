import axios from "axios";
import { API_SERVER_HOST } from "../../component/common/Variables";
import { handleApiError } from "../../component/common/Functions";

const SIGN_IN_SERVER_HOST = `${API_SERVER_HOST}/api/signIn`;

//ID 중복검사
export const idTest = async (id) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/idTest`, {
      loginId: id,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

//이메일 중복검사
export const emailTest = async (email) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/emailTest`, {
      email: email,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

//시설 리스트 get
export const getFacilityList = async (search) => {
  try {
    const res = await axios.get(`${SIGN_IN_SERVER_HOST}/getFacilityList`, {
      params: { search: search },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

//장애 리스트 get
export const getDisabilityList = async (search) => {
  try {
    const res = await axios.get(`${SIGN_IN_SERVER_HOST}/getDisabilityList`, {
      params: { search: search },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

//회원가입 - 시설
export const facilitySignIn = async (dto) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/facility`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

//회원가입 - 개인
export const individualSignIn = async (dto) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/individual`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};