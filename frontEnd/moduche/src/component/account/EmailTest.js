import { OneAlignedButton } from '../common/Button';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Grid, TextField, useMediaQuery } from '@mui/material';
import { emailTest } from '../../api/accountAPI';
import Layout from '../common/Layout';
import CustomTextField from '../common/CustomTextField';

const EmailTest = ({ email, setEmail, emailError, setEmailError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [emailCode, setEmailCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [count, setCount] = useState(30);
  const [timerId, setTimerId] = useState(null);

  const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  useEffect(() => {
    //이메일 검증
    if (email.length > 0 && !regEmail.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [email]);

  const checkEmail = async () => {
    //중복 Email 체크 로직

    const res = await emailTest(email);
    alert(res.message);
    if (res.status == 'OK') {
      setIsSent(true);
    } else {
      setEmailError(true);
      return;
    }
    console.log(res);

    setCount(300);

    if (timerId) clearInterval(timerId); // 이전 타이머 제거

    const id = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerId(id);
  };

  //타이머
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <>
      <Grid size={isMobile ? 7 : 8} marginBottom={'5%'}>
        <CustomTextField
          data={email}
          setData={setEmail}
          placeholder={'이메일'}
          error={emailError}
          helperText={'이메일 형식이 올바르지 않습니다.'}
          padding={10}
        />
      </Grid>
      <Grid size={isMobile ? 5 : 4}>
        <OneAlignedButton
          buttonWrapperSx={{ width: '100%' }}
          onClick={checkEmail}
          disabled={emailError || email.length == 0}
        >
          이메일 인증
        </OneAlignedButton>
      </Grid>
      {isSent ? (
        <>
          <Grid size={isMobile ? 7 : 8} marginBottom={'5%'}>
            <TextField
              value={emailCode}
              placeholder="이메일 인증코드"
              helperText={
                formatTime(count) == '00:00'
                  ? '이메일 인증 버튼 클릭 후, 메일함을 확인해주세요.'
                  : formatTime(count)
              }
              fullWidth
              inputProps={{
                style: { padding: 10 },
              }}
              type="text"
              onChange={(e) => {
                setEmailCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
              }}
            />
          </Grid>
          <Grid size={isMobile ? 5 : 4}>
            <OneAlignedButton
              buttonWrapperSx={{ width: '100%' }}
              // onClick={checkDuplicated}
            >
              인증코드 확인
            </OneAlignedButton>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default EmailTest;
