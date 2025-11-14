import { Outlet, useNavigate } from 'react-router-dom';
import Layout from '../../component/common/Layout';
import Paper from '../../component/common/Paper';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, Contents100 } from '../../component/common/Text';
import { useEffect, useState } from 'react';
import CustomTextField from '../../component/common/CustomTextField';
import { OneAlignedButton } from '../../component/common/Button';
import { getRoleFromToken, getUsernameFromToken } from '../../utils/auth';
import { useApi } from '../../hook/useAPI';
import { checkPassword } from '../../api/accountAPI/MyPageAPI';
import Loading from '../../component/common/Loading';

const Auth = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [checked, setChecked] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const { callApi: checkPasswordAPI, loading, done } = useApi(checkPassword);
  const handleCheckPassword = async () => {
    const res = await checkPasswordAPI(
      getUsernameFromToken(accessToken),
      password,
    );
    setChecked(res.data);
  };

  useEffect(() => {
    if (!done) return;
    if (!checked) {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordError(true);
    }
  }, [done, checked]);

  useEffect(() => {
    setPasswordError(false);
  }, [password]);

  return (
    <Box
      display={done && checked ? 'none' : 'fixed'}
      width={'100vw'}
      height={'100vh'}
      zIndex={1500}
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Layout spacing={2} padding={2}>
        <Loading open={loading} text="비밀번호 검증 중입니다." />
        {!isMobile ? <Grid size={3} /> : <></>}
        <Grid size={isMobile ? 12 : 6}>
          <CenterTitle margin="5% 0">비밀번호 확인</CenterTitle>
          <Paper>
            <Contents100 sx={{ textAlign: 'center' }} margin="0 0 5% 0">
              마이페이지 진입을 위해 비밀번호를 한 번 더 확인합니다.
            </Contents100>
            <CustomTextField
              data={password}
              setData={setPassword}
              name={'password'}
              placeholder={'비밀번호'}
              error={passwordError}
              helperText={'비밀번호가 일치하지 않습니다.'}
              show={false}
            />
            <Box sx={{ marginTop: '5%' }} />
            <Layout space={2}>
              {isNotMonitor ? <></> : <Grid size={3} />}
              <Grid size={isNotMonitor ? 6 : 3}>
                <OneAlignedButton
                  buttonWrapperSx={{ width: '100%' }}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </OneAlignedButton>
              </Grid>
              <Grid size={isNotMonitor ? 6 : 3}>
                <OneAlignedButton
                  buttonWrapperSx={{ width: '100%' }}
                  onClick={handleCheckPassword}
                >
                  확인
                </OneAlignedButton>
              </Grid>
              {isNotMonitor ? <></> : <Grid size={3} />}
            </Layout>
          </Paper>
        </Grid>
        {!isMobile ? <Grid size={3} /> : <></>}
      </Layout>
    </Box>
  );
};
export default Auth;
