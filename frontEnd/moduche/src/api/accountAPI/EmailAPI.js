import axios from "axios";
import { API_SERVER_HOST } from "../../component/common/Variables";
import { handleApiError } from "../../component/common/Functions";

const EMAIL_SERVER_HOST = `${API_SERVER_HOST}/api/email`;

//인증코드 검증
export const codeTest = async (email, code) => {
  try {
    const res = await axios.post(`${EMAIL_SERVER_HOST}/codeTest`, {
      email: email,
      code: code,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};