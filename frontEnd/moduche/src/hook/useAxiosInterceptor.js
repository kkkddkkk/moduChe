import axios from 'axios';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';

export const useAxiosInterceptor = () => {
  const { setLoggedIn, setName } = useUser();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          setLoggedIn(false);
          setName(null);
          localStorage.removeItem('accessToken'); // 필요하면 토큰 제거
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setLoggedIn, setName]);
};
