import { Box, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import { CenterTitle, SubTitle } from '../../component/common/Text';
import Paper from '../../component/common/Paper';
import CustomTextField from '../../component/common/CustomTextField';
import {
  CalendarDays,
  Check,
  Circle,
  Eraser,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  Minus,
  Phone,
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
import { SetPhoneNumber } from '../../component/myPage/MyPageButtonsFields';
import AdditionalInfo from '../../component/account/AdditionalInfo';

const ManageDisability = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));
  const accessToken = localStorage.getItem('accessToken');

  const [number, setNumber] = useState('');
  const [birth, setBirth] = useState('');
  const [backFirst, setBackFirst] = useState('');
  const [disability, setDisability] = useState('');
  const [degree, setDegree] = useState('');
  const [qualified, setQualified] = useState(false);

  //error
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [birthError, setBirthError] = useState(false);
  const [backFirstError, setBackFirstError] = useState(false);
  const [additionalError, setAdditionalError] = useState(null);

  //#region[정규식+검증]

  const regBirth = /^\d{6}$/;
  const regBackFirst = /^[1-8]$/;

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

  const handleChangeDisability = () => {
    if (number.length == 0) {
      alert('전화번호가 입력되지 않았습니다.');
      return;
    }
    if (numberError) {
      alert('전화번호 입력란을 다시 확인해주세요.');
      return;
    }
    if (birth.length == 0 || backFirst.length == 0) {
      alert('생년월일이 입력되지 않았습니다.');
      return;
    }
    if (birthError || backFirstError) {
      alert('생년월일 입력란을 다시 확인해주세요.');
      return;
    }
  };

  return (
    <Layout space={2}>
      {/* <Loading open={loadingForSet} text="로딩 중입니다." /> */}
      {isMobile ? <></> : <Grid size={3} />}
      <Grid size={isMobile ? 12 : 6}>
        <CenterTitle>개인정보 관리</CenterTitle>
        <Paper>
          <Layout space={2} padding={2}>
            <Grid size={12}>
              <SetPhoneNumber
                number={number}
                setNumber={setNumber}
                numberError={numberError}
                setNumberError={setNumberError}
              />
            </Grid>
            <Grid size={12} marginTop={'5%'}>
              <MyPageText icon={<CalendarDays />}>생년월일</MyPageText>
            </Grid>
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
        </Paper>
        <Box marginTop={"5%"}/>
        <AdditionalInfo
          disability={disability}
          setDisability={setDisability}
          degree={degree}
          setDegree={setDegree}
          additionalError={additionalError}
          setAdditionalError={setAdditionalError}
          qualified={qualified}
          setQualified={setQualified}
        />
        <MyPageButtons
          eraseFunc={() => {
            // setEmail(originForm.email);
            // setEmailChecked(true);
            // setName(originForm.name);
            // setPasswordChange(false);
          }}
          saveFunc={handleChangeDisability}
        />
      </Grid>
      {isMobile ? <></> : <Grid size={3} />}
    </Layout>
  );
};
export default ManageDisability;
