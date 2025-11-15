import { Box, Grid, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Paper from '../../component/common/Paper';
import EmailTest from '../../component/account/EmailTest';
import { CenterTitle } from '../../component/common/Text';

const FindAccount = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const tabLabels = ['ID 찾기', '비밀번호 재설정'];
  const [title, setTitle] = useState('ID 찾기');

  const commonTabStyle = (isMobile, theme, isActive) => ({
    alignItems: 'flex-start',
    fontSize: isMobile ? '0.9rem' : '1.15rem',
    fontWeight: isActive ? 600 : 500,
    textAlign: 'center',
    minHeight: 48,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  });

  return (
    <Layout padding={2}>
      <Grid size={12} sx={{ minHeight: 0 }}>
        <Tabs
          orientation={'horizontal'}
          variant="scrollable"
          value={tab}
          onChange={(e, value) => {
            setTab(value); // index 저장
            setTitle(tabLabels[value]);
            setEmail('');
            setEmailChecked(false);
            setEmailError(false);
          }}
          sx={{
            minHeight: 0,
            borderBottom: 'none',
            borderColor: 'divider',
            minWidth: '100%',
            alignItems: 'center',
            display: 'flex',
            '& .MuiTabs-indicator': {
              left: 0,
              right: 0,
              width: 5,
              height: 5,
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTabs-list, & .MuiTabs-flexContainer': {
              minHeight: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
          <Tab
            label="ID 찾기"
            sx={commonTabStyle(isMobile, theme, tab === 0)}
            onClick={() => navigate('id')}
          />
          <Tab
            label="비밀번호 재설정"
            sx={commonTabStyle(isMobile, theme, tab === 1)}
            onClick={() => navigate('pw')}
          />
        </Tabs>
        <Box sx={{ marginTop: 5 }} />
        <Layout space={2}>
          {isMobile ? <></> : <Grid size={3} />}
          <Grid size={isMobile ? 12 : 6}>
            <Paper sx={{ minHeight: '60vh' }}>
              <Layout space={2}>
                <Grid size={12} sx={{ padding: 0 }}>
                  <CenterTitle>{title}</CenterTitle>
                </Grid>
                <Outlet
                  context={{
                    email,
                    setEmail,
                    emailError,
                    setEmailError,
                    emailChecked,
                    setEmailChecked,
                  }}
                />
              </Layout>
            </Paper>
          </Grid>
          {isMobile ? <></> : <Grid size={3} />}
        </Layout>
      </Grid>
    </Layout>
  );
};
export default FindAccount;
