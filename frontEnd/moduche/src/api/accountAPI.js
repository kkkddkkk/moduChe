import axios from 'axios';
import { handleApiError } from '../component/common/Functions';
import { API_SERVER_HOST } from '../component/common/Variables';

const SIGN_IN_SERVER_HOST = `${API_SERVER_HOST}/api/signIn`;

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
