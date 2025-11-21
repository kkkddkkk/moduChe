import { Box, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import {
  CenterTitle,
  Contents100,
  SubTitle,
} from '../../component/common/Text';
import Paper from '../../component/common/Paper';
import CustomTextField from '../../component/common/CustomTextField';
import {
  CalendarDays,
  Check,
  Circle,
  Eraser,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  Mail,
  Minus,
  Phone,
  Save,
  User,
  User2,
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
  getDisability,
  setAccount,
  setDisability,
} from '../../api/accountAPI/MyPageAPI';
import { getUsernameFromToken } from '../../utils/auth';
import Loading from '../../component/common/Loading';
import MyPageButtons from '../../component/myPage/MyPageButtons';
import { MyPageText } from '../../component/myPage/MyPageTexts';
import { SetPhoneNumber } from '../../component/myPage/MyPageButtonsFields';
import AdditionalInfo from '../../component/account/AdditionalInfo';
import {
  CustomSelect,
  StandardSelect,
} from '../../component/common/CustomSelect';

const ManageDisability = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));
  const accessToken = localStorage.getItem('accessToken');

  //form
  const [originForm, setOriginForm] = useState(null);
  const [number, setNumber] = useState('');
  const [birth, setBirth] = useState('');
  const [sex, setSex] = useState(null);
  const sexes = [
    { label: '남성', value: 'M' },
    { label: '여성', value: 'F' },
  ];
  const [myDisability, setMyDisability] = useState('');
  const [degree, setDegree] = useState('');
  const [qualified, setQualified] = useState(false);
  const [note, setNote] = useState('');

  //error
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [birthError, setBirthError] = useState(false);
  const [backFirstError, setBackFirstError] = useState(false);
  const [additionalError, setAdditionalError] = useState(null);

  //#region[정규식+검증]

  const regBirth = /^\d{6}$/;

  useEffect(() => {
    //생일 검증
    if (birth.length > 0 && !regBirth.test(birth)) {
      setBirthError(true);
    } else {
      setBirthError(false);
    }
  }, [birth]);

  //#endregion

  const { callApi: getDisabilityAPI } = useApi(getDisability);
  const { callApi: setDisabilityAPI, loading, done, setDone } = useApi(setDisability);
  useEffect(() => {
    const myDisability = async () => {
      const res = await getDisabilityAPI(getUsernameFromToken(accessToken));
      const data = res.data;
      setOriginForm({
        phone: data.phone,
        birth: data.birth,
        sex: data.sex,
        disability: data.disability,
        disabilityGrade: data.disabilityGrade,
        qualified: data.qualified,
        note: data.note,
      });
      setNumber(data.phone);
      setBirth(data.birth);
      setSex(data.sex);
      setMyDisability(data.disability);
      setDegree(data.disabilityGrade);
      setQualified(data.qualified);
      setNote(data.note);
    };
    myDisability();
  }, []);

  const handleChangeDisability = async () => {
    if (number.length == 0) {
      alert('전화번호가 입력되지 않았습니다.');
      return;
    }
    if (numberError) {
      alert('전화번호 입력란을 다시 확인해주세요.');
      return;
    }
    if (birth.length == 0) {
      alert('생년월일이 입력되지 않았습니다.');
      return;
    }
    if (birthError) {
      alert('생년월일 입력란을 다시 확인해주세요.');
      return;
    }

    const dto = {
      username: getUsernameFromToken(accessToken),
      phone: number,
      birth: birth,
      sex: sex,
      disability: myDisability,
      disabilityGrade: degree,
      qualified: qualified,
      note: note,
    };
    await setDisabilityAPI(dto);
  };

  useEffect(() => {
    if (!done) return;
    setOriginForm({
      phone: number,
      birth: birth,
      sex: sex,
      disability: myDisability,
      disabilityGrade: degree,
      qualified: qualified,
      note: note,
    });
    alert('개인정보가 변경되었습니다.');
    setDone(false);
  }, [done]);

  return (
    <>
      <Paper>
        <Loading open={loading} text="정보 수정 중입니다." />
        <Layout space={3} padding={2}>
          <Grid size={12}>
            <SetPhoneNumber
              number={number}
              setNumber={setNumber}
              numberError={numberError}
              setNumberError={setNumberError}
            />
          </Grid>
          <Grid size={12}>
            <MyPageText icon={<CalendarDays />}>생년월일</MyPageText>
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
          <Grid size={12} marginTop={'5%'}>
            <MyPageText icon={<User />}>성별</MyPageText>
            <StandardSelect
              data={sexes}
              selected={sex}
              setSelected={setSex}
              format={(d) => d.label}
              renderValue={(value) =>
                sexes.find((c) => c.value === value)?.label || ''
              }
            />
          </Grid>
        </Layout>
      </Paper>
      <Box marginTop={'5%'} />
      <AdditionalInfo
        disability={myDisability}
        setDisability={setMyDisability}
        degree={degree}
        setDegree={setDegree}
        additionalError={additionalError}
        setAdditionalError={setAdditionalError}
        qualified={qualified}
        setQualified={setQualified}
        inMypage={true}
      />
      <Box marginTop={'5%'} />
      <Paper>
        <Layout space={2} padding={2}>
          <Grid size={12}>
            <MyPageText icon={<FileText />}>추가 정보</MyPageText>
            <Contents100 color={'text.secondary'}>
              * 나에 대한 추가 정보(보조장치, 활동지원사 등)를 작성해주세요.
            </Contents100>
            <CustomTextField
              rows={10}
              data={note}
              setData={setNote}
              padding={8}
              placeholder={
                '* 나에 대한 추가 정보(보조장치, 활동지원사 등)를 작성해주세요.'
              }
            />
          </Grid>
        </Layout>
      </Paper>
      <MyPageButtons
        eraseFunc={() => {
          setNumber(originForm.phone);
          setBirth(originForm.birth);
          setSex(originForm.sex);
          setMyDisability(originForm.disability);
          setDegree(originForm.disabilityGrade);
          setQualified(originForm.qualified);
          setNote(originForm.note);
        }}
        saveFunc={handleChangeDisability}
      />
    </>
  );
};
export default ManageDisability;
