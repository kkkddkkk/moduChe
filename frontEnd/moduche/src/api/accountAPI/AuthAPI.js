import axios from "axios";
import { handleApiError } from "../../component/common/Functions";
import { API_SERVER_HOST } from "../../component/common/Variables";

const AUTH_SERVER_HOST = `${API_SERVER_HOST}/api/auth`;

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



export const logIn = async (dto) => {
  try {
    const res = await axios.post(`${AUTH_SERVER_HOST}/login`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const logOut = async (username) => {
  const dto = {
    username: username,
  };

  try {
    const res = await axios.post(`${AUTH_SERVER_HOST}/logout`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const setPw = async (username, password) => {
  const dto = {
    username: username,
    password, password
  };

  try {
    const res = await axios.post(`${AUTH_SERVER_HOST}/changePw`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};