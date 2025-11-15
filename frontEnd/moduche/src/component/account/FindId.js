import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import EmailTest from './EmailTest';
import { SignInText } from './SignInText';
import { useEffect, useState } from 'react';
import { findId } from '../../api/accountAPI/FindAPI';

const FindId = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    emailChecked,
    setEmailChecked,
  } = useOutletContext();

  const [id, setId] = useState('');

  useEffect(()=>{
    if(!emailChecked) return;

  },[emailChecked])


  return (
    <>
    <SignInText title={'이메일'} />
      <EmailTest
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        setEmailError={setEmailError}
        emailChecked={emailChecked}
        setEmailChecked={setEmailChecked}
        checkLogic={findId}
        setData={setId}
      />
      <Grid size={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.main}`,
            minHeight: 120,
            borderRadius: '5px',
            marginTop: '5%',
            fontWeight: 'bold',
            fontSize: '24px',
          }}
        >
          {emailChecked ? `${id}님, 안녕하세요.` : '이메일 인증을 완료해주세요.'}
        </Box>
      </Grid>
    </>
  );
};
export default FindId;
