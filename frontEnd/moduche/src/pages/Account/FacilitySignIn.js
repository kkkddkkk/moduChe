import Layout from '../../component/common/Layout';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import { useState } from 'react';
import AccountInfo from '../../component/account/AccountInfo';
import { OneAlignedButton } from '../../component/common/Button';
import FacilityInfo from '../../component/account/FacilityInfo';

const SignIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  //form
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [chkPw, setChkPw] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [facility, setFacility] = useState(null);

  //error
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [chkPwError, setChkPwError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState(false);

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={3} />}
      <Grid size={isMobile ? 12 : 6}>
        <CenterTitle>회원가입</CenterTitle>
        <SubTitle>* 계정정보</SubTitle>
        <AccountInfo
          id={id}
          setId={setId}
          idError={idError}
          setIdError={setIdError}
          password={password}
          setPassword={setPassword}
          pwError={pwError}
          setPwError={setPwError}
          chkPw={chkPw}
          setChkPw={setChkPw}
          chkPwError={chkPwError}
          setChkPwError={setChkPwError}
        />
        <Box marginTop={'5%'} />
        <SubTitle>* 시설정보</SubTitle>
        <FacilityInfo
          facility={facility}
          setFacility={setFacility}
          number={number}
          setNumber={setNumber}
          numberError={numberError}
          setNumberError={setNumberError}
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
        />
        <Box marginTop={'5%'} />
        <SubTitle>* 시설인증</SubTitle>
        <Layout>
          <Grid size={2} />
          <Grid size={8}>
            <OneAlignedButton buttonWrapperSx={{ width: '100%' }}>
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
