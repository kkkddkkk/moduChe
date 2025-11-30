import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SlideModal } from '../common/Modals';
import Layout from '../common/Layout';
import { ActivityIcon, Bell, Book, Heart, IdCard, MessageCircle, User, Users } from 'lucide-react';
import {
  getRoleFromToken,
  getUsernameFromToken,
  isLoggedIn,
} from '../../utils/auth';
import { Activity, useEffect, useState } from 'react';
import { useApi } from '../../hook/useAPI';
import { logOut } from '../../api/accountAPI/AuthAPI';
import { useUser } from '../../context/UserContext';

const MenuModal = ({ open, setOpen }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const menuList = [
    {
      key: 'notice',
      label: '공지사항',
      icon: <Bell />,
      path: '/notice',
    },
    {
      key: 'report',
      label: '문의하기',
      icon: <MessageCircle />,
      path: '/',
    },
    {
      key: 'community',
      label: '동아리',
      icon: <Users />,
      path: '/community/home',
    },
    {
      key: 'course',
      label: '강좌',
      icon: <Book />,
      path: '/',
    },
    {
      key: 'myFit',
      label: '추천운동',
      icon: <ActivityIcon />,
      path: '/',
    },
  ];

  const [role, setRole] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (isLoggedIn()) {
      setRole(getRoleFromToken(accessToken).toLowerCase());
    }
  }, []);

  const moveToMyPage = () => {
    if (role.includes('admin')) {
      navigate('/admin/dashboard');
      return;
    }
    navigate('/myPage/account');
  };

  const moveTo = (item) => {
    return navigate(`/account/${item}`);
  };

  const { callApi: logoutAPI, loading, done, setDone } = useApi(logOut);
  const { loggedIn, setLoggedIn } = useUser();
  const logout = async () => {
    const result = window.confirm('로그아웃 하시겠습니까?');
    if (!result) return;
    await logoutAPI(getUsernameFromToken(accessToken));
  };
  useEffect(() => {
    if (!done) return;
    setLoggedIn(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    navigate('/');
    setOpen(false);
    setDone(false);
  }, [done]);

  return (
    <SlideModal
      open={open}
      close={() => setOpen(false)}
      position={'left'}
      width="40"
      title={'로그인'}
    >
      <Box
        sx={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-between',
          width: '100%',
        }}
      >
        {/* 상단 프로필 */}
        {loggedIn && (
          <Box sx={{ p: 2, borderBottom: '1px solid', textAlign: 'center' }}>
            <Button
              fullWidth
              startIcon={<User />}
              sx={{ padding: 0, fontSize: 24 }}
              onClick={moveToMyPage}
            >
              {localStorage.getItem('name')}님
            </Button>
          </Box>
        )}

        {/* 중앙 메뉴 리스트 */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List>
            {menuList.map(({ key, icon, label, path }) => (
              <Box key={key}>
                <ListItemButton
                  onClick={() => {
                    navigate(path);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>

        {/* 하단 버튼 */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            width: '100%',
          }}
        >
          {loggedIn ? (
            <Button fullWidth color="error" onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                onClick={() => {
                  moveTo('login');
                  setOpen(false);
                }}
              >
                로그인
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  moveTo('joinUs');
                  setOpen(false);
                }}
              >
                회원가입
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </SlideModal>
  );
};
export default MenuModal;
