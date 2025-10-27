import { useSearchParams } from 'react-router-dom';
import Layout from '../../component/common/Layout';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import { useState } from 'react';
import AccountInfo from '../../component/account/AccountInfo';
import PersonalInfo from '../../component/account/PersonalInfo';
import AdditionalInfo from '../../component/account/AdditionalInfo';
import { OneAlignedButton } from '../../component/common/Button';

const SignIn = () => {
  const [searchParam] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const signRole = searchParam.get('role');

  //form
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [chkPw, setChkPw] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  //additional for individual
  const [disability, setDisability] = useState('');
  const [degree, setDegree] = useState('');

  //error
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [chkPwError, setChkPwError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState(false);

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={2} />}
      <Grid size={isMobile ? 12 : 8}>
        <CenterTitle>회원가입</CenterTitle>
        <Layout space={2}>
          <Grid size={isMobile || isTablet ? 12 : 6}>
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
          </Grid>
          <Grid size={isMobile || isTablet ? 12 : 6} marginTop={isMobile || isTablet ? "5%" : 0}>
            <SubTitle>* {signRole==="individual"?"개인":"시설"}정보</SubTitle>
            <PersonalInfo
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              setEmailError={setEmailError}
              number={number}
              setNumber={setNumber}
              numberError={numberError}
              setNumberError={setNumberError}
            />
          </Grid>
        </Layout>
        <Box marginTop={'5%'} />
        <SubTitle>* 추가 정보</SubTitle>
        <AdditionalInfo
          disability={disability}
          setDisability={setDisability}
          degree={degree}
          setDegree={setDegree}
        />
        <Box marginTop={'5%'} />
        <OneAlignedButton>회원가입</OneAlignedButton>
        <Box marginTop={'10%'} />
      </Grid>
      {isMobile ? <></> : <Grid size={2} />}
    </Layout>
  );
};
export default SignIn;
