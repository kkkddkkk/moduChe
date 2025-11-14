import axios from 'axios';
import { handleApiError } from '../../component/common/Functions';
import api from '../axiosInstance';

const MYPAGE_SERVER_HOST = `/myPage`;

export const checkPassword = async (username, password) => {
  const dto = { loginId: username, password: password };
  try {
    const res = await api.post(`${MYPAGE_SERVER_HOST}/checkPassword`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const emailTest = async (email) => {
  const dto = { email: email };
  try {
    const res = await api.post(`${MYPAGE_SERVER_HOST}/emailTest`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAccount = async (username) => {
  try {
    const res = await api.get(`${MYPAGE_SERVER_HOST}/getAccount?username=${username}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const setAccount = async (dto) => {
  try {
    const res = await api.put(`${MYPAGE_SERVER_HOST}/setAccount`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getDisability = async (username) => {
  try {
    const res = await api.get(`${MYPAGE_SERVER_HOST}/getDisability?username=${username}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const setDisability = async (dto) => {
  try {
    const res = await api.put(`${MYPAGE_SERVER_HOST}/setDisability`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};


export const getFacility = async (username) => {
  try {
    const res = await api.get(`${MYPAGE_SERVER_HOST}/getFacility?username=${username}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const setFacility = async (dto) => {
  try {
    const res = await api.put(`${MYPAGE_SERVER_HOST}/setFacility`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};


