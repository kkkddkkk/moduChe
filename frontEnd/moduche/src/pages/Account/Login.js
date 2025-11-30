import { Box, Divider, Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import CustomTextField from '../../component/common/CustomTextField';
import { useCallback, useEffect, useState } from 'react';
import { OneAlignedButton } from '../../component/common/Button';
import {
  CenterTitle,
  Contents,
  Contents100,
} from '../../component/common/Text';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../../component/account/KakaoLoginButton';
import NaverLoginButton from '../../component/account/NaverLoginButton';
import GoogleLoginButton from '../../component/account/GoogleLoginButton';
import { useApi } from '../../hook/useAPI';
import Loading from '../../component/common/Loading';
import { useUser } from '../../context/UserContext';
import { logIn } from '../../api/accountAPI/AuthAPI';

const Login = () => {
  //HOOK 정의
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  //form state 객체화(id, password)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  //error state 객체화(id, password)
  const [idError, setIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  //ID, Password 에러 설정 후 form에 변화있으면 error=false
  useEffect(() => {
    if (idError) setIdError(false);
  }, [id]);
  useEffect(() => {
    if (passwordError) setPasswordError(false);
  }, [password]);

  //로그인 시도
  const { callApi: loginAPI, loading, done, setDone } = useApi(logIn);
  const { setName, setLoggedIn } = useUser(); //전역에 이름 저장

  const tryLogin = useCallback(async () => {
    const dto = {
      loginId: id,
      password: password,
    };
    const res = await loginAPI(dto);
    const data = res.data;
    setSuccess(data.allSuccess);
    setMessage(res.message);
    if (!data.allSuccess) {
      if (!data.idSuccess) setIdError(true);
      else setPasswordError(true);
      return;
    }
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('name', data.name);
    setName(data.name);
    setLoggedIn(true);
  }, [id, password]);

  useEffect(() => {
    if (!done) return;
    alert(message);
    if (!success) {
      setDone(false);
      return;
    }
    navigate('/');
  }, [done, success]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        tryLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tryLogin]);
  
  //margin 주는 용도
  const LoginDivider = () => {
    return (
      <Box
        sx={{
          width: '100%',
          marginBottom: '5%',
          display: 'block', // flex 제거
          '& > *': { width: '100%', boxSizing: 'border-box' },
        }}
      ></Box>
    );
  };

  //로그인 버튼 밑 text 설정
  const LoginText = ({ children, item, last }) => {
    const gray = theme.palette.text.secondary;
    const moveTo = (item) => {
      return navigate(`/account/${item}`);
    };
    return (
      <>
        <Contents color={gray} hover onClick={() => moveTo(item)} fontSize={18}>
          {children}
        </Contents>
        {!last ? <Contents color={gray}>&nbsp;|&nbsp;</Contents> : <></>}
      </>
    );
  };

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 4} />}
      <Loading open={loading} text="로그인 중입니다." />
      <Grid size={isMobile ? 12 : isTablet ? 8 : 4}>
        <CenterTitle>로그인</CenterTitle>
        <Box
          width={'100%'}
          display={'flex'}
          alignItems={'center'}
          margin={'5% 0'}
          flexWrap={'nowrap'}
          flexDirection={'column'}
        >
          <Box
            component={'img'}
            src={`/logo/MODUCHE_LOGO.png`}
            sx={{
              width: '160px',
              height: 'auto',
              display: 'inline-block',
              marginBottom: '2%',
            }}
          />
          <Contents100 sx={{ textAlign: 'center' }} fontSize={18}>
            처음 이용하신다면 회원가입 후 로그인해주세요.
            <br />
            기존 회원은 아이디와 비밀번호로 로그인 가능합니다.
          </Contents100>
        </Box>
        <CustomTextField
          data={id}
          setData={setId}
          placeholder={'아이디'}
          error={idError}
          helperText={'ID가 존재하지 않습니다.'}
        />
        <LoginDivider />
        <CustomTextField
          data={password}
          setData={setPassword}
          name={'password'}
          placeholder={'비밀번호'}
          error={passwordError}
          helperText={'비밀번호가 올바르지 않습니다.'}
          show={false}
        />
        <LoginDivider />
        <OneAlignedButton
          buttonWrapperSx={{ width: '100%' }}
          onClick={tryLogin}
        >
          로그인
        </OneAlignedButton>
        <Box width={'100%'} textAlign={'center'} margin={'5% 0'}>
          <LoginText item={'joinUs'}>회원가입</LoginText>
          <LoginText item={'find/Id'} last>
            아이디/비밀번호 찾기
          </LoginText>
        </Box>
      </Grid>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 4} />}
    </Layout>
  );
};
export default Login;
