import axios from 'axios';
import { handleApiError } from '../component/common/Functions';
import { API_SERVER_HOST } from '../component/common/Variables';

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

//인증코드 검증
export const codeTest = async (email, code) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/test`, {
      email: email,
      code: code
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

//사업자 인증 API
const BusinessApi = axios.create({
  baseURL: 'https://api.odcloud.kr/api/nts-businessman/v1',
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

export const validateBusiness = async ({ businessNum, startDate, boss }) => {
  try {
    const res = await BusinessApi.post(
      `/validate?serviceKey=${process.env.REACT_APP_HOMETAX_API_KEY}`,
      {
        businesses: [
          {
            b_no: businessNum,
            start_dt: startDate,
            p_nm: boss,
            p_nm2: '',
            b_nm: '',
            corp_no: '',
            b_sector: '',
            b_type: '',
            b_adr: '',
          },
        ],
      },
    );

    const item = res.data.data[0];

    if (item.valid === '02') {
      return { success: false, message: item.valid_msg };
    }

    return { success: true, data: item };
  } catch (error) {
    console.error(error.response?.data || error.message);
    handleApiError(error);
  }
};

//회원가입 - 시설
export const facilitySignIn = async (dto) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/facility`,dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

//회원가입 - 개인
export const individualSignIn = async (dto) => {
  try {
    const res = await axios.post(`${SIGN_IN_SERVER_HOST}/individual`,dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};