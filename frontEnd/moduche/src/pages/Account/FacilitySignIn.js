import Layout from '../../component/common/Layout';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import { useEffect, useRef, useState } from 'react';
import AccountInfo from '../../component/account/AccountInfo';
import { OneAlignedButton } from '../../component/common/Button';
import FacilityInfo from '../../component/account/FacilityInfo';
import BusinessCert from '../../component/account/BusinessCert';
import { useNavigate } from 'react-router-dom';
import Loading from '../../component/common/Loading';
import { useApi } from '../../hook/useAPI';
import { facilitySignIn } from '../../api/accountAPI/signInAPI';

const SignIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const navigate = useNavigate();

  //ref
  const accountRef = useRef(null);
  const facilityRef = useRef(null);
  const certRef = useRef(null);

  //form
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [chkPw, setChkPw] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [facility, setFacility] = useState(null);
  const [businessNum, setBusinessNum] = useState('');
  const [boss, setBoss] = useState('');

  //error
  const [accountError, setAccountError] = useState({
    message: '',
    ready: false,
  });
  const [facilityError, setFacilityError] = useState({
    message: '',
    ready: false,
  });
  const [businessAuthError, setBusinessAuthError] = useState({
    message: '',
    ready: false,
  });

  const { callApi: signInAPI, loading } = useApi(facilitySignIn);
  const [done, setDone] = useState(false);

  const signIn = async () => {
    if (!accountError.ready) {
      alert(accountError.message);
      accountRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
    if (!facilityError.ready) {
      alert(facilityError.message);
      facilityRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
    if (!businessAuthError.ready) {
      alert(businessAuthError.message);
      certRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    const dto = {
      username: id,
      password: password,
      facilityId: facility.id,
      email: email,
      phone: number,
      businessNum: businessNum,
      boss: boss,
    };

    const res = await signInAPI(dto);
    setDone(true);
  };

  useEffect(() => {
    if(loading || !done) return;
    alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
    navigate(`/account/login`);
  }, [loading, done]);

  return (
    <Layout padding={2}>
      <Loading open={loading} text={'회원가입 중입니다.'} />
      {isMobile ? <></> : <Grid size={3} />}
      <Grid size={isMobile ? 12 : 6}>
        <Box ref={accountRef} />
        <CenterTitle>회원가입</CenterTitle>
        <SubTitle>* 계정정보</SubTitle>
        <AccountInfo
          id={id}
          setId={setId}
          password={password}
          setPassword={setPassword}
          chkPw={chkPw}
          setChkPw={setChkPw}
          accountError={accountError}
          setAccountError={setAccountError}
        />
        <Box marginTop={'5%'} />
        <Box ref={facilityRef} />
        <SubTitle>* 시설정보</SubTitle>
        <FacilityInfo
          facility={facility}
          setFacility={setFacility}
          number={number}
          setNumber={setNumber}
          email={email}
          setEmail={setEmail}
          facilityError={facilityError}
          setFacilityError={setFacilityError}
        />
        <Box marginTop={'5%'} />
        <Box ref={certRef} />
        <SubTitle>* 시설인증</SubTitle>
        <BusinessCert
          businessNum={businessNum}
          setBusinessNum={setBusinessNum}
          setBusinessAuthError={setBusinessAuthError}
          businessAuthError={businessAuthError}
          boss={boss}
          setBoss={setBoss}
        />
        <Box marginTop={'5%'} />
        <Layout>
          <Grid size={2} />
          <Grid size={8}>
            <OneAlignedButton
              buttonWrapperSx={{ width: '100%' }}
              onClick={signIn}
            >
              회원가입
            </OneAlignedButton>
          </Grid>
          <Grid size={2} />
        </Layout>

        <Box marginTop={'10%'} />
      </Grid>
      {isMobile ? <></> : <Grid size={3} />}
    </Layout>
  );
};
export default SignIn;
