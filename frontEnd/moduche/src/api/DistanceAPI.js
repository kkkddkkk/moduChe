
import axios from 'axios';
import { handleApiError } from '../component/common/Functions';
import { API_SERVER_HOST } from '../component/common/Variables';

const DISTANCE_SERVER_HOST = `${API_SERVER_HOST}/api/main/distance`;

export const getList = async (lat, lng) => {
  try {
    const res = await axios.get(`${DISTANCE_SERVER_HOST}/getList`, {
      params: { lat, lng },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};