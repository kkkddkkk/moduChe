import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from './route/root';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Theme from './component/common/Theme';
import { getUserContext, UserProvider } from './context/UserContext';
import { LogoutWatcher } from './context/LogoutWatcher';
import api from './api/axiosInstance';
import { isLoggedIn, isTokenExpired } from './utils/auth';
import { useEffect } from 'react';

const initializeToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;
  const { setLoggedIn, setName, logout } = getUserContext();
  setLoggedIn(isLoggedIn(token));
  // 토큰 만료 확인
  if (isTokenExpired(token)) {
    try {
      const res = await api.post('/auth/reissue'); // 여기서 refreshToken 쿠키 자동 전송
      localStorage.setItem('accessToken', res.data.data); // 새 토큰 저장
      setLoggedIn(isLoggedIn(localStorage.getItem('accessToken')));
    } catch (err) {
      logout(token);
    }
  }
};

export default function App() {
  useEffect(() => {
    initializeToken();
  }, []);
  return (
    <UserProvider>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <RouterProvider router={root}>
          <LogoutWatcher />
        </RouterProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
