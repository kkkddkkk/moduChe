import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import CustomTextField from '../common/CustomTextField';
import { OneAlignedButton } from '../common/Button';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SignInText } from './SignInText';

const PersonalInfo = ({
  name,
  setName,
  email,
  setEmail,
  number,
  setNumber,
  emailError,
  setEmailError,
  numberError,
  setNumberError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [searchParam] = useSearchParams();
  const signRole = searchParam.get('role');

  //정규식
  const regPhone = /^01[016789]-?\d{3,4}-?\d{4}$/;
  const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  useEffect(() => {
    if (email.length > 0 && !regEmail.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [email]);

  useEffect(() => {
    if (number.length > 0 && !regPhone.test(number)) {
      setNumberError(true);
    } else {
      setNumberError(false);
    }
  }, [number]);

  const checkDuplicated = () => {
    alert('중복?');
  };

  return (
    <Paper sx={{ height: isMobile || isTablet ? 'auto' : '50vh' }}>
      <Layout>
        <SignInText title={signRole === 'individual' ? '이름' : '시설명'} />
        <Grid size={12} marginBottom={'5%'}>
          <CustomTextField
            data={name}
            setData={setName}
            placeholder={signRole === 'individual' ? '이름' : '시설명'}
            padding={10}
          />
        </Grid>
        <SignInText title={'이메일'} />
        <Grid size={8} marginBottom={'5%'}>
          <CustomTextField
            data={email}
            setData={setEmail}
            placeholder={'이메일'}
            error={emailError}
            helperText={'이메일 형식이 올바르지 않습니다.'}
            padding={10}
          />
        </Grid>
        <Grid size={4}>
          <OneAlignedButton
            sx={{ height: '100%', width: '100%' }}
            // onClick={checkDuplicated}
          >
            이메일 검증
          </OneAlignedButton>
        </Grid>
        <SignInText title={'전화번호'} />
        <Grid size={12} marginBottom={'5%'}>
          <CustomTextField
            data={number}
            setData={setNumber}
            placeholder={'전화번호'}
            error={numberError}
            helperText={'전화번호 형식이 올바르지 않습니다.'}
            padding={10}
          />
        </Grid>
      </Layout>
    </Paper>
  );
};
export default PersonalInfo;
