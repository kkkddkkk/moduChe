import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from './route/root';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Theme from './component/common/Theme';
import { UserProvider } from './context/UserContext';
import { useAxiosInterceptor } from './hook/useAxiosInterceptor';
import { LogoutWatcher } from './context/LogoutWatcher';

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  useAxiosInterceptor();

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <RouterProvider router={root}>
        <LogoutWatcher />
      </RouterProvider>
    </ThemeProvider>
  );
}


