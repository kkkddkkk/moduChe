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

  // 토큰 만료 확인
  if (isTokenExpired(token)) {
    try {
      const res = await api.post('/auth/reissue'); // 여기서 refreshToken 쿠키 자동 전송
      localStorage.setItem('accessToken', res.data.data); // 새 토큰 저장
    } catch (err) {
      console.log('초기 토큰 재발급 실패', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('name');
      const { setLoggedIn, setName } = getUserContext();
      setLoggedIn(isLoggedIn());
      setName(null);
    }
  }
};

export default function App() {
  useEffect(()=>{
    initializeToken();
  },[])
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
