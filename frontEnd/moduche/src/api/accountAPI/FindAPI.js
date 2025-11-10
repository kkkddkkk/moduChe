import axios from 'axios';
import { handleApiError } from '../../component/common/Functions';
import { API_SERVER_HOST } from '../../component/common/Variables';

const FIND_SERVER_HOST = `${API_SERVER_HOST}/api/find`;

//ID 찾기 - 이메일 코드 보내기
export const findId = async (email) => {
  const dto = {
    email: email,
  };

  try {
    const res = await axios.post(`${FIND_SERVER_HOST}/id`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

//PW 찾기 - 이메일 코드 보내기
export const findPw = async (username, email) => {
  const dto = {
    username: username,
    email: email,
  };

  try {
    const res = await axios.post(`${FIND_SERVER_HOST}/pw`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};
