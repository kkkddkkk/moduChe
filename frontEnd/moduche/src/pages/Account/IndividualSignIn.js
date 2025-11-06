import Layout from '../../component/common/Layout';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import { useEffect, useRef, useState } from 'react';
import AccountInfo from '../../component/account/AccountInfo';
import PersonalInfo from '../../component/account/PersonalInfo';
import AdditionalInfo from '../../component/account/AdditionalInfo';
import { OneAlignedButton } from '../../component/common/Button';
import { individualSignIn } from '../../api/accountAPI';
import { useApi } from '../../hook/useAPI';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  //hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const navigate = useNavigate();

  //ref
  const accountRef = useRef(null);
  const personalRef = useRef(null);
  const additionalRef = useRef(null);

  //form
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [chkPw, setChkPw] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [birth, setBirth] = useState('');
  const [backFirst, setBackFirst] = useState('');
  const [disability, setDisability] = useState('');
  const [degree, setDegree] = useState('');

  //error
  const [accountError, setAccountError] = useState({
    message: '',
    ready: false,
  });
  const [personalError, setPersonalError] = useState({
    message: '',
    ready: false,
  });
  const [additionalError, setAdditionalError] = useState({
    message: '',
    ready: false,
  });

  const { callApi: signInAPI, loading } = useApi(individualSignIn);
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
    if (!personalError.ready) {
      alert(personalError.message);
      personalRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
    if (!additionalError.ready) {
      console.log(additionalError);
      alert(additionalError.message);
      additionalRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    const dto = {
      username: id,
      password: password,
      // facilityId: facility.id,
      // email: email,
      // phone: number,
      // businessNum: businessNum,
      // boss: boss,
    };

    const res = await signInAPI(dto);
    setDone(true);
  };

  useEffect(() => {
    if (loading || !done) return;
    alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
    navigate(`/account/login`);
  }, [loading, done]);

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={3} />}
      <Grid size={isMobile ? 12 : 6}>
        <CenterTitle>회원가입</CenterTitle>
        <Box ref={accountRef} />
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
        <Box ref={personalRef} />
        <SubTitle>* 개인정보</SubTitle>
        <PersonalInfo
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          number={number}
          setNumber={setNumber}
          birth={birth}
          setBirth={setBirth}
          backFirst={backFirst}
          setBackFirst={setBackFirst}
          personalError={personalError}
          setPersonalError={setPersonalError}
        />
        <Box marginTop={'5%'} />
        <Box ref={additionalRef} />
        <SubTitle>* 추가 정보</SubTitle>
        <AdditionalInfo
          disability={disability}
          setDisability={setDisability}
          degree={degree}
          setDegree={setDegree}
          additionalError={additionalError}
          setAdditionalError={setAdditionalError}
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
