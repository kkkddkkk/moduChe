import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../component/common/Layout';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { useEffect, useMemo } from 'react';
import { IdCard, User, UserRoundPlus } from 'lucide-react';
import { CenterTitle } from '../../component/common/Text';
import {
  fecilityList,
  individualList,
  MeunTemplate,
} from '../../component/myPage/MyPageMenuList';
import { getRoleFromToken } from '../../utils/auth';
import { getUserContext } from '../../context/UserContext';

const MyPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));

  const listWidth = isNotMonitor ? 4 : 2;
  const DRAWER_WIDTH = !isNotMonitor?'240px' : '80px';
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');
  const role = getRoleFromToken(accessToken).toLowerCase();
  const { loggedIn } = getUserContext();
  useEffect(() => {
    if (!loggedIn) navigate('/');
  }, []);

  // ✅ 메뉴 정의
  const MENU_ITEMS =
    role == 'individual'
      ? individualList
      : role == 'facility'
      ? fecilityList
      : [];

  const currentKey = useMemo(() => {
    const found = MENU_ITEMS.find((item) =>
      location.pathname.startsWith(item.path),
    );
    return found ? found.key : null;
  }, [location.pathname]);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            pt: 1,
          },
        }}
        open
      >
        <Box sx={{ minHeight: 64, px: 2, fontWeight: 600 }}></Box>
        <List sx={{ py: 0 }}>
          <ListItemButton
            key={'role'}
            sx={{
              py: 1.1,
              mx: 1,
              mb: 0.5,
              cursor: 'auto',
              '&:hover': {
                backgroundColor: 'transparent', // hover 시 배경색 없음
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent', // selected 효과 없애려면
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'primary.main',
              }}
            >
              <User />
            </ListItemIcon>

            <ListItemText
              primary={'일반회원'}
              primaryTypographyProps={{
                fontSize: '1.2rem',
                fontWeight: 600,
              }}
            />
          </ListItemButton>
          <Divider />

          {MENU_ITEMS?.map((item) => {
            const selected = currentKey === item.key;
            return (
              <MeunTemplate
                key={item.key}
                label={item.label}
                icon={item.icon}
                path={item.path}
                selected={selected}
              />
            );
          })}
        </List>
      </Drawer>
      <Layout spacing={2}>
         <Grid size={12} sx={{ height: '100%' }}>
          <Outlet />
        </Grid>
      </Layout>
    </Box>
  );
};
export default MyPage;
