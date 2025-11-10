import { Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import EmailTest from './EmailTest';
import { useOutletContext } from 'react-router-dom';
import CustomTextField from '../common/CustomTextField';
import { useEffect, useState } from 'react';
import Loading from '../common/Loading';
import { OneAlignedButton } from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';
import { SignInText } from './SignInText';
import Layout from '../common/Layout';
import { codeTest } from '../../api/accountAPI/EmailAPI';
import { findPw } from '../../api/accountAPI/FindAPI';

const FindId = () => {
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    emailChecked,
    setEmailChecked,
  } = useOutletContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotDeskTop = useMediaQuery(theme.breakpoints.down('lg'));

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [chkPw, setChkPw] = useState('');

  const [pwError, setPwError] = useState(false);
  const [chkPwError, setChkPwError] = useState(false);

  const [disableId, setDisableId] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  //#region[정규식+검증]
  const regPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!~@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/; //6자 이상 영어+숫자+특수문자

  //비밀번호 검증
  useEffect(() => {
    if (password.length > 0 && !regPassword.test(password)) {
      setPwError(true);
    } else {
      setPwError(false);
    }
  }, [password]);

  useEffect(() => {
    if (chkPw.length > 0 && password !== chkPw) {
      setChkPwError(true);
    } else {
      setChkPwError(false);
    }
  }, [chkPw, password]);

  //#endregion

  useEffect(() => {
    if (!emailChecked) return;
    setDisableId(true);
  }, [emailChecked]);

  const changePw = () => {
    if (password.length === 0 || chkPw.length === 0) {
      alert('비밀번호가 입력되지 않았습니다.');
      return;
    }
    if (pwError || chkPwError) {
      alert('비밀번호 입력란을 다시 확인해주세요.');
      return;
    }
  };

  return (
    <>
      <SignInText title={'아이디'} />
      <Grid size={12} marginBottom={'5%'}>
        <CustomTextField
          data={id}
          setData={setId}
          placeholder={'아이디'}
          padding={10}
          disabled={disableId}
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
        checkLogic={() => findPw(id, email)}
      />
      {emailChecked ? (
        <>
          <Grid size={isNotDeskTop ? 10 : 11} marginBottom={'5%'}>
            <SignInText title={'비밀번호'} />
            <CustomTextField
              show={show1}
              data={password}
              setData={setPassword}
              placeholder={'비밀번호'}
              error={pwError}
              helperText={'6자 이상의 영어+숫자+특수문자로 입력해주세요.'}
              padding={10}
            />
          </Grid>
          <Grid size={isNotDeskTop ? 2 : 1} container justifyContent="end">
            {show1 ? (
              <EyeOff
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow1(false)}
                cursor={'pointer'}
              />
            ) : (
              <Eye
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow1(true)}
                cursor={'pointer'}
              />
            )}
          </Grid>

          <Grid size={isNotDeskTop ? 10 : 11} marginBottom={'5%'}>
            <SignInText title={'비밀번호 확인'} />
            <CustomTextField
              show={show2}
              data={chkPw}
              setData={setChkPw}
              placeholder={'비밀번호 확인'}
              error={chkPwError}
              helperText={'비밀번호가 일치하지 않습니다.'}
              padding={10}
            />
          </Grid>
          <Grid size={isNotDeskTop ? 2 : 1} container justifyContent="end">
            {show2 ? (
              <EyeOff
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow2(false)}
                cursor={'pointer'}
              />
            ) : (
              <Eye
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow2(true)}
                cursor={'pointer'}
              />
            )}
          </Grid>
        </>
      ) : (
        <></>
      )}
      <Layout>
        <Grid size={2} />
        <Grid size={8}>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            onClick={changePw}
          >
            비밀번호 변경
          </OneAlignedButton>
        </Grid>
        <Grid size={2} />
      </Layout>
    </>
  );
};
export default FindId;
