import { handleApiError } from '../../component/common/Functions';
import api from '../axiosInstance';

const COMMUNITY_SERVER_HOST = `/admin/community`;

export const fetchCommunity = async (page = 0, size = 10, keyword = null, status = null) => {
  try {
    const res = await api.get(`${COMMUNITY_SERVER_HOST}/fetchCommunity`, {
      params: { page, size, keyword, status },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const fetchCommunityDetail = async (communityId) => {
  try {
    const res = await api.get(`${COMMUNITY_SERVER_HOST}/fetchCommunityDetail`, {
      params: { communityId },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const modifyCommunityStatus = async (communityId, status) => {
  try {
    const res = await api.put(`${COMMUNITY_SERVER_HOST}/modifyCommunityStatus`, null, {
      params: { communityId, status },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

// export const deleteNotice = async (noticeId) => {
//   try {
//     const res = await api.delete(`${NOTICE_SERVER_HOST}/deleteNotice`, {
//       params: { noticeId },
//     });
//     return res.data;
//   } catch (err) {
//     handleApiError(err);
//   }
// };
