import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import CustomTextField from '../common/CustomTextField';
import { OneAlignedButton } from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignInText } from './SignInText';
import { idTest } from '../../api/accountAPI';
import Loading from '../common/Loading';
import { useApi } from '../../hook/useAPI';

const AccountInfo = ({
  id,
  setId,
  password,
  setPassword,
  chkPw,
  setChkPw,
  accountError,
  setAccountError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isNotDeskTop = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [idHelperText, setIdHelperText] = useState('5자 ~ 16자의 영어 + 숫자로 입력해주세요.');

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [idError, setIdError] = useState(false);
  const [IdChecked, setIdChecked] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [chkPwError, setChkPwError] = useState(false);

  const { callApi: checkIdApi, loading } = useApi(idTest);

  //예외처리
  useEffect(() => {
    if (id.length === 0) {
      setAccountError({ message: 'ID가 입력되지 않았습니다.', ready: false });
      return;
    }
    if (idError) {
      setAccountError({
        message: 'ID 입력란을 다시 확인해주세요.',
        ready: false,
      });
      return;
    }
    if (!IdChecked) {
      setAccountError({
        message: 'ID 중복확인 버튼을 클릭해주세요.',
        ready: false,
      });
      return;
    }
    if (password.length === 0 || chkPw.length === 0) {
      setAccountError({
        message: '비밀번호가 입력되지 않았습니다.',
        ready: false,
      });
      return;
    }
    if (pwError || chkPwError) {
      setAccountError({
        message: '비밀번호 입력란을 다시 확인해주세요.',
        ready: false,
      });
      return;
    }
    setAccountError({ message: '계정정보 준비 완료', ready: true });
  }, [id, password, chkPw, idError, IdChecked, pwError, chkPwError]);

  //#region[정규식+검증]
  const regId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/; //5~116자 숫자+영어
  const regPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!~@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/; //6자 이상 영어+숫자+특수문자

  useEffect(() => {
    if (id.length > 0 && !regId.test(id)) {
      setIdError(true);
    } else {
      setIdError(false);
    }
    setIdHelperText('5자 ~ 16자의 영어 + 숫자로 입력해주세요.');
  }, [id]);

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

  //중복 ID 체크 로직
  const checkId = async () => {
    const res = await checkIdApi(id);
    alert(res.message);
    if (res.status !== 'OK') {
      setIdError(true);
      setIdChecked(false);
      setIdHelperText('이미 사용 중인 ID입니다.');
    } else {
      setIdChecked(true);
    }
    console.log(res);
  };

  //ID 값 바뀌면 setIdChecked를 false로
  useEffect(() => {
    setIdChecked(false);
  }, [id]);

  return (
    <Paper sx={{ height: 'auto' }}>
      <Loading open={loading} text={'로딩 중입니다.'}/>
      <SignInText title={'아이디'} />
      <Layout space={2}>
        <Grid size={8} marginBottom={'5%'}>
          <CustomTextField
            data={id}
            setData={setId}
            placeholder={'아이디'}
            error={idError}
            helperText={idHelperText}
            padding={10}
          />
        </Grid>
        <Grid size={4}>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            onClick={checkId}
            disabled={idError || id.length == 0 || IdChecked}
          >
            중복확인
          </OneAlignedButton>
        </Grid>

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
      </Layout>
    </Paper>
  );
};
export default AccountInfo;
