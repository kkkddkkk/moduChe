import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import Paper from '../../component/common/Paper';
import CustomTextField from '../../component/common/CustomTextField';
import {
  Check,
  Eraser,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  Save,
  User,
} from 'lucide-react';
import {
  OneAlignedButton,
  TwoAlignedButtons,
} from '../../component/common/Button';
import { useEffect, useState } from 'react';
import EmailTest from '../../component/account/EmailTest';
import { useApi } from '../../hook/useAPI';
import {
  emailTest,
  getAccount,
  setAccount,
} from '../../api/accountAPI/MyPageAPI';
import { getUsernameFromToken } from '../../utils/auth';
import Loading from '../../component/common/Loading';
import MyPageButtons from '../../component/myPage/MyPageButtons';
import { MyPageText } from '../../component/myPage/MyPageTexts';

const ManageAccount = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));
  const accessToken = localStorage.getItem('accessToken');

  const [emailChange, setEmailChange] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);

  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [chkPwError, setChkPwError] = useState(false);

  const [emailChecked, setEmailChecked] = useState(true);

  const [originForm, setOriginForm] = useState(null);
 

  //#region[정규식+검증]
  const regPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!~@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/; //6자 이상 영어+숫자+특수문자

  useEffect(() => {
    if (password.length > 0 && !regPassword.test(password)) {
      setPwError(true);
    } else {
      setPwError(false);
    }
  }, [password]);

  useEffect(() => {
    if (checkPassword.length > 0 && password !== checkPassword) {
      setChkPwError(true);
    } else {
      setChkPwError(false);
    }
  }, [checkPassword, password]);

  useEffect(() => {
    if (email === null || originForm === null) return;
    if (originForm.email === email) setEmailChecked(true);
  }, [email, originForm]);
  //#endregion

  const { callApi: getAccountAPI } = useApi(getAccount);
  const { callApi: emailTestAPI } = useApi(emailTest);

  useEffect(() => {
    const getMyAccount = async () => {
      const res = await getAccountAPI(getUsernameFromToken(accessToken));
      const data = res.data;
      setEmail(data.email);
      setName(data.name);
      setOriginForm({
        name: data.name,
        email: data.email,
      });
    };
    getMyAccount();
  }, []);

  const {
    callApi: setAccountAPI,
    loadingForSet,
    done,
    setDone,
  } = useApi(setAccount);
  const handleChangeAccount = async () => {
    //예외처리
    if (passwordChange) {
      if (password.length === 0 || checkPassword.length === 0) {
        alert('비밀번호가 입력되지 않았습니다.');
        return;
      }
      if (pwError || chkPwError) {
        alert('비밀번호 입력란을 다시 확인해주세요.');
        return;
      }
    }
    if (!emailChecked) {
      alert('이메일 인증이 완료되지 않았습니다.');
      return;
    }
    const dto = {
      username: getUsernameFromToken(accessToken),
      name: name,
      email: email,
      password: password,
    };
    await setAccountAPI(dto);
  };

  useEffect(() => {
    if (!done) return;
    setOriginForm({
      name: name,
      email: email,
    });
    localStorage.setItem('name', name);
    alert('개인정보가 변경되었습니다.');
    setDone(false);
  }, [done]);

  return (
    <Layout space={2}>
      <Loading open={loadingForSet} text="로딩 중입니다." />
      {isMobile ? <></> : <Grid size={3} />}
      <Grid size={isMobile ? 12 : 6}>
        <CenterTitle>계정 관리</CenterTitle>
        <Paper>
          <Layout space={2} padding={2}>
            <Grid size={12}>
              <MyPageText icon={<IdCard />}>아이디</MyPageText>
              <CustomTextField
                disabled={true}
                data={getUsernameFromToken(accessToken)}
                padding={8}
              />
            </Grid>
            <Grid size={12} marginTop={'5%'}>
              <MyPageText icon={<User />}>이름</MyPageText>
              <CustomTextField data={name} setData={setName} padding={8} />
            </Grid>
            <Grid size={12} marginTop={'5%'}>
              <MyPageText icon={<Mail />}>이메일</MyPageText>
            </Grid>
            <EmailTest
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              setEmailError={setEmailError}
              emailChecked={emailChecked}
              setEmailChecked={setEmailChecked}
              checkLogic={emailTestAPI}
            />

            <Grid size={12}>
              <MyPageText icon={<Lock />}>비밀번호 변경</MyPageText>
              <Layout space={2}>
                <Grid size={7}>
                  <CustomTextField
                    show={show1}
                    data={passwordChange ? password : '*********'}
                    setData={setPassword}
                    placeholder={passwordChange ? '비밀번호' : '*********'}
                    error={pwError}
                    helperText={'6자 이상의 영어+숫자+특수문자로 입력'}
                    padding={10}
                    disabled={!passwordChange}
                  />
                </Grid>
                <Grid size={1} paddingBottom={'1.5%'}>
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
                <Grid size={4}>
                  {!passwordChange ? (
                    <OneAlignedButton
                      buttonWrapperSx={{ width: '100%' }}
                      buttonSx={{ padding: '8px' }}
                      onClick={() => setPasswordChange(true)}
                    >
                      비밀번호 변경
                    </OneAlignedButton>
                  ) : (
                    <OneAlignedButton
                      buttonWrapperSx={{ width: '100%' }}
                      buttonSx={{ padding: '8px' }}
                      onClick={() => setPasswordChange(false)}
                      color="error"
                    >
                      취소
                    </OneAlignedButton>
                  )}
                </Grid>
              </Layout>
            </Grid>

            {passwordChange ? (
              <>
                <Grid size={12} marginTop={'5%'}>
                  <MyPageText icon={<Check />}>비밀번호 확인</MyPageText>
                  <Layout space={2}>
                    <Grid size={7}>
                      <CustomTextField
                        show={show2}
                        data={checkPassword}
                        setData={setCheckPassword}
                        placeholder={'비밀번호 확인'}
                        error={chkPwError}
                        helperText={'비밀번호가 일치하지 않습니다.'}
                        padding={10}
                      />
                    </Grid>
                    <Grid size={1} paddingBottom={'1.5%'}>
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
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Layout>
        </Paper>
        <MyPageButtons
          eraseFunc={() => {
            setEmail(originForm.email);
            setEmailChecked(true);
            setName(originForm.name);
            setPasswordChange(false);
          }}
          saveFunc={handleChangeAccount}
        />
      </Grid>
      {isMobile ? <></> : <Grid size={3} />}
    </Layout>
  );
};
export default ManageAccount;
