import { Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import CustomTextField from '../common/CustomTextField';
import { useEffect, useState } from 'react';
import { SignInText } from './SignInText';
import { Circle, Minus } from 'lucide-react';
import EmailTest from './EmailTest';
import { emailTest } from '../../api/accountAPI/signInAPI';

const PersonalInfo = ({
  name,
  setName,
  email,
  setEmail,
  number,
  setNumber,
  birth,
  setBirth,
  backFirst,
  setBackFirst,
  personalError,
  setPersonalError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [emailChecked, setEmailChecked] = useState(false);

  //error
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [birthError, setBirthError] = useState(false);
  const [backFirstError, setBackFirstError] = useState(false);

  //#region[정규식+검증]
  const regPhone = /^(01[016789]\d{3,4}\d{4}|0\d{1,2}\d{3,4}\d{4})$/;
  const regBirth = /^\d{6}$/;
  const regBackFirst = /^[1-8]$/;

  function regPhoneNumber(numbers) {
    if (numbers.startsWith('01')) {
      // 휴대전화
      numbers = numbers.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('02')) {
      // 2자리 지역번호
      numbers = numbers.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '$1-$2-$3');
    } else {
      // 3자리 지역번호
      numbers = numbers.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3');
    }

    // 마지막 하이픈 제거 (있으면)
    numbers = numbers.replace(/-$/g, '');
    return numbers;
  }

  useEffect(() => {
    //번호 검증
    if (number.length > 0 && !regPhone.test(number)) {
      setNumberError(true);
    } else {
      setNumberError(false);
    }
  }, [number]);

  useEffect(() => {
    //생일 검증
    if (birth.length > 0 && !regBirth.test(birth)) {
      setBirthError(true);
    } else {
      setBirthError(false);
    }
  }, [birth]);

  useEffect(() => {
    //주민번호 7번째 자리 검증
    if (backFirst.length > 0 && !regBackFirst.test(backFirst)) {
      setBackFirstError(true);
    } else {
      setBackFirstError(false);
    }
  }, [backFirst]);
  //#endregion

  //#region[예외처리]
  useEffect(() => {
    if (name.length == 0) {
      setPersonalError({
        message: '이름이 입력되지 않았습니다.',
        ready: false,
      });
      return;
    }
    if (!emailChecked) {
      setPersonalError({
        message: '이메일 인증이 완료되지 않았습니다.',
        ready: false,
      });
      return;
    }
    if (number.length == 0) {
      setPersonalError({
        message: '전화번호가 입력되지 않았습니다.',
        ready: false,
      });
      return;
    }
    if (numberError) {
      setPersonalError({
        message: '전화번호 입력란을 다시 확인해주세요.',
        ready: false,
      });
      return;
    }
    if (birth.length == 0 || backFirst.length == 0) {
      setPersonalError({
        message: '생년월일이 입력되지 않았습니다.',
        ready: false,
      });
      return;
    }
    if (birthError || backFirstError) {
      setPersonalError({
        message: '생년월일 입력란을 다시 확인해주세요.',
        ready: false,
      });
      return;
    }
    setPersonalError({
      message: '개인정보 입력 완료!',
      ready: true,
    });
  }, [
    name,
    email,
    emailError,
    emailChecked,
    number,
    numberError,
    birth,
    birthError,
    backFirst,
    backFirstError,
  ]);
  //#endregion

  return (
    <Paper sx={{ height: 'auto' }}>
      <Layout space={2}>
        <SignInText title={'이름'} first />
        <Grid size={12} marginBottom={'5%'}>
          <CustomTextField
            data={name}
            setData={setName}
            placeholder={'이름'}
            padding={10}
          />
        </Grid>
        <SignInText title={'이메일'} />
        <EmailTest
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
          emailChecked={emailChecked}
          setEmailChecked={setEmailChecked}
          checkLogic={emailTest}
        />
        <SignInText title={'전화번호'} />
        <Grid size={12} marginBottom={'5%'}>
          <TextField
            value={regPhoneNumber(number)}
            placeholder="전화번호"
            error={numberError}
            helperText={numberError ? '올바르지 않은 형식입니다.' : ''}
            fullWidth
            inputProps={{
              style: { padding: 10 },
            }}
            type="text"
            onChange={(e) => {
              setNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11));
            }}
          />
        </Grid>
        <SignInText title={'주민등록번호'} />
        <Grid size={12} marginBottom={'5%'}>
          <Layout>
            <Grid size={6}>
              <TextField
                value={birth}
                placeholder="생년월일"
                error={birthError}
                helperText={birthError ? '올바르지 않은 형식입니다.' : ''}
                fullWidth
                inputProps={{
                  style: { padding: 10 },
                }}
                type="text"
                onChange={(e) => {
                  setBirth(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                }}
              />
            </Grid>
            <Grid
              size={1}
              sx={{
                fontSize: 30,
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <Minus></Minus>
            </Grid>
            <Grid size={5}>
              <Layout space={1}>
                <Grid size={4}>
                  <TextField
                    value={backFirst}
                    error={backFirstError}
                    helperText={''}
                    fullWidth
                    inputProps={{
                      style: { padding: 10 },
                    }}
                    type="text"
                    onChange={(e) => {
                      setBackFirst(
                        e.target.value.replace(/[^0-8]/g, '').slice(0, 1),
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={8}
                  sx={{
                    fontSize: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Circle style={{ fill: 'currentColor' }} />
                  <Circle style={{ fill: 'currentColor' }} />
                  <Circle style={{ fill: 'currentColor' }} />
                  <Circle style={{ fill: 'currentColor' }} />
                  <Circle style={{ fill: 'currentColor' }} />
                  <Circle style={{ fill: 'currentColor' }} />
                </Grid>
              </Layout>
            </Grid>
          </Layout>
        </Grid>
      </Layout>
    </Paper>
  );
};
export default PersonalInfo;
