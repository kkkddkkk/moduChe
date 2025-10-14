import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from './route/root';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Theme from './component/common/Theme';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <RouterProvider router={root}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
