import {
  Box,
  Divider,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Contents } from '../common/Text';
import { SlideModal } from '../common/Modals';
import { useEffect, useRef, useState } from 'react';
import CustomTextField from '../common/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken, isLoggedIn, isTokenExpired } from '../../utils/auth';
import { User } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useApi } from '../../hook/useAPI';
import Loading from '../common/Loading';
import { logOut } from '../../api/accountAPI/AuthAPI';

const Header = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const headerRef = useRef(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const { loggedIn, setLoggedIn } = useUser();
  const name = localStorage.getItem("name");

  const menuColor = theme.palette.primary.main;

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    setLoggedIn(isLoggedIn());
    console.log(isTokenExpired(accessToken));
  }, []);

  const moveTo = (item) => {
    return navigate(`/account/${item}`);
  };

  const clickSearchButton = () => {
    setOpenSearch(!openSearch);
  };

  const { callApi: logoutAPI, loading, done } = useApi(logOut);
  const logout = () => {
    const result = window.confirm('로그아웃 하시겠습니까?');
    if (!result) return;
    logoutAPI(getUsernameFromToken(accessToken));
  };
  useEffect(() => {
    if (!done) return;
    setLoggedIn(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    navigate('/');
  }, [done]);

  const HeaderMenu = ({ children, onClick }) => {
    return (
      <Contents color={menuColor} hover={true} onClick={onClick} bold>
        {children}
      </Contents>
    );
  };

  const MenuBar = () => {
    return (
      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: menuColor }}
      />
    );
  };

  const HeaderIcon = ({ children, onClick }) => {
    return (
      <IconButton
        size="large"
        edge="end"
        color={menuColor}
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={onClick}
      >
        {children}
      </IconButton>
    );
  };

  return (
    <>
      <AppBar position="sticky" ref={headerRef} sx={{ zIndex: 1500 }}>
        <Loading open={loading} text='로그아웃 처리 중입니다.'/>
        <Toolbar sx={{ backgroundColor: theme.palette.background.default }}>
          <Box component={'div'} flexGrow={1}>
            <Box
              component={'img'}
              src={`/logo/MODUCHE_LOGO.png`}
              sx={{
                width: '160px',
                height: 'auto',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Box>

          <HeaderMenu onClick={clickSearchButton}>검색하기</HeaderMenu>
          <HeaderIcon onClick={clickSearchButton}>
            <SearchIcon sx={{ color: menuColor, fontWeight: 'bold' }} />
          </HeaderIcon>
          {!isMdUp ? (
            <HeaderIcon>
              {' '}
              <MenuIcon />
            </HeaderIcon>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center', // 세로 가운데 정렬
                gap: 1, // 항목 간 간격
              }}
            >
              {loggedIn ? (
                <>
                  <HeaderMenu onClick={logout}>로그아웃</HeaderMenu>
                  <MenuBar />
                  <User style={{ color: menuColor }} />
                  <HeaderMenu onClick={() => moveTo('auth')}>
                    {name}님
                  </HeaderMenu>
                </>
              ) : (
                <>
                  <HeaderMenu onClick={() => moveTo('login')}>
                    로그인
                  </HeaderMenu>
                  <MenuBar />
                  <HeaderMenu onClick={() => moveTo('joinUs')}>
                    회원가입
                  </HeaderMenu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <SlideModal
        position={'top'}
        open={openSearch}
        close={() => setOpenSearch(false)}
        headerHeight={headerHeight || 0}
        title={'검색해보기~'}
      >
        <Grid size={2} />
        <Grid size={8}>
          <CustomTextField
            data={search}
            setData={setSearch}
            placeholder={'성남님 여기에 퀵서치 디자인해서 넣으시면 될듯요'}
            padding={12}
          />
        </Grid>
        <Grid size={2} />
      </SlideModal>
    </>
  );
};
export default Header;
