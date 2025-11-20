
import axios from 'axios';
import { handleApiError } from '../component/common/Functions';
import api from './axiosInstance';
import { API_SERVER_HOST } from '../component/common/Variables';

const NOTICE_SERVER_HOST = `${API_SERVER_HOST}/api/noticeForAll`;

export const fetchNotice = async (page = 0, size = 10, keyword = null) => {
  try {
    const res = await axios.get(`${NOTICE_SERVER_HOST}/fetchNotice`, {
      params: { page, size, keyword },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};
