import { Outlet, useNavigate } from 'react-router-dom';
import Layout from '../../component/common/Layout';
import Paper from '../../component/common/Paper';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, Contents100 } from '../../component/common/Text';
import { useState } from 'react';
import CustomTextField from '../../component/common/CustomTextField';
import { OneAlignedButton } from '../../component/common/Button';

const Auth = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const checkPassword = () => {};
  return (
    <Layout spacing={2} padding={2}>
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
            helperText={'비밀번호가 올바르지 않습니다.'}
            show={false}
          />
          <Box sx={{ marginTop: '5%' }} />
          <Layout space={2}>
            <Grid size={3} />
            <Grid size={3}>
              <OneAlignedButton
                buttonWrapperSx={{ width: '100%' }}
                onClick={()=>navigate(-1)}
              >
                뒤로가기
              </OneAlignedButton>
            </Grid>
            <Grid size={3}>
              <OneAlignedButton
                buttonWrapperSx={{ width: '100%' }}
                onClick={checkPassword}
              >
                로그인
              </OneAlignedButton>
            </Grid>
            <Grid size={3} />
          </Layout>
        </Paper>
      </Grid>
      {!isMobile ? <Grid size={3} /> : <></>}
    </Layout>
  );
};
export default Auth;
