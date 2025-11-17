import { handleApiError } from '../../component/common/Functions';
import api from '../axiosInstance';

const NOTICE_SERVER_HOST = `/notice`;

export const fetchNotice = async (page = 0, size = 10) => {
  try {
    const res = await api.get(`${NOTICE_SERVER_HOST}/fetchNotice`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const fetchNoticeDetail = async (noticeId) => {
  try {
    const res = await api.get(`${NOTICE_SERVER_HOST}/fetchNoticeDetail`, {
       params: { noticeId }
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};


export const createNotice = async (dto) => {
    try {
        const res = await api.post(`${NOTICE_SERVER_HOST}/createNotice`, dto, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};
