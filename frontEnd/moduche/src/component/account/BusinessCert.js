import {
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import { SignInText } from './SignInText';
import { useState } from 'react';
import CustomTextField from '../common/CustomTextField';
import { OneAlignedButton } from '../common/Button';
import { validateBusiness } from '../../api/accountAPI/AuthAPI';

const BusinessCert = ({
  businessNum,
  setBusinessNum,
  boss,
  setBoss,
  businessAuthError,
  setBusinessAuthError,
  retry=false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [startDate, setStartDate] = useState('');
  const [certCheck, setCertCheck] = useState(false);

  //사업자번호 formatting
  function formatBusinessNum(numbers) {
    // 숫자만 남기기
    numbers = numbers.replace(/\D/g, '');

    // 3자리, 2자리, 나머지로 유동적 포맷
    numbers = numbers.replace(
      /^(\d{0,3})(\d{0,2})(\d{0,5})$/,
      (match, p1, p2, p3) => {
        let result = '';
        if (p1) result += p1;
        if (p2) result += p2 ? '-' + p2 : '';
        if (p3) result += p3 ? '-' + p3 : '';
        return result;
      },
    );
    return numbers;
  }

  //date formatting
  function formatDate(numbers) {
    numbers = numbers.replace(/\D/g, '');

    numbers = numbers.replace(
      /^(\d{0,4})(\d{0,2})(\d{0,2})$/,
      (match, p1, p2, p3) => {
        let result = '';
        if (p1) result += p1;
        if (p2) result += p2 ? '-' + p2 : '';
        if (p3) result += p3 ? '-' + p3 : '';
        return result;
      },
    );
    return numbers;
  }

  const businessAuth = async () => {
    if (businessNum.length !== 10 || boss === '' || startDate.length !== 8) {
      alert('사업자 인증을 위한 필수값이 입력되지 않았습니다.');
      setBusinessAuthError({message: '사업자 인증을 위한 필수값이 입력되지 않았습니다.', ready: false});
      return;
    }
    const result = await validateBusiness({ businessNum, startDate, boss });
    console.log(result.data.status.b_stt_cd);
    if (!result.success) {
      alert('사업자 등록 정보를 다시 확인해주세요.');
      setBusinessAuthError({message: result.message, ready: false});
    } else {
      if(result.data.status.b_stt_cd!=="01"){
        alert('휴업/폐업 상태의 사업자입니다.');
        setBusinessAuthError({message: result.message, ready: false});
        return;
      }
      alert('사업자 인증이 완료되었습니다.');
      setBusinessAuthError({message: "사업자 인증 완료", ready: true});
      setCertCheck(true);
    }
  };

  return (
    <Paper>
      <Layout space={3}>
        <Grid size={12} marginBottom={'5%'}>
          <SignInText title={'사업자등록번호'} />
          <TextField
            value={formatBusinessNum(businessNum)}
            placeholder="사업자등록번호"
            error={businessNum.length !== 0 && businessNum.length !== 10}
            helperText={
              businessNum.length !== 0 && businessNum.length !== 10
                ? '올바르지 않은 형식입니다.'
                : ''
            }
            fullWidth
            inputProps={{
              style: { padding: 10 },
            }}
            type="text"
            onChange={(e) => {
              setBusinessNum(
                e.target.value.replace(/[^0-9]/g, '').slice(0, 10),
              );
            }}
            disabled={certCheck}
          />
        </Grid>
        <Grid size={isMobile ? 12 : 6} marginBottom={'5%'}>
          <SignInText title={'대표자명'} />
          <CustomTextField
            data={boss}
            setData={setBoss}
            placeholder={'외국인 사업자의 경우에는 영문명 입력'}
            padding={10}
            disabled={certCheck}
          />
        </Grid>
        <Grid size={isMobile ? 12 : 6} marginBottom={'5%'}>
          <SignInText title={'개업일자(YYYYMMDD)'} />
          <TextField
            value={formatDate(startDate)}
            placeholder="사업자등록증에 표기된 날짜로 입력"
            fullWidth
            error={startDate.length !== 0 && startDate.length !== 8}
            helperText={
              startDate.length !== 0 && startDate.length !== 8
                ? '올바르지 않은 형식입니다.'
                : ''
            }
            inputProps={{
              style: { padding: 10 },
            }}
            type="text"
            onChange={(e) => {
              setStartDate(e.target.value.replace(/[^0-9]/g, '').slice(0, 8));
            }}
            disabled={certCheck}
          />
        </Grid>
        <Grid size={12}>
          <Layout>
            <Grid size={3} />
            <Grid size={6}>
              <OneAlignedButton
                buttonWrapperSx={{ width: '100%' }}
                onClick={businessAuth}
                disabled={certCheck}
              >
                사업자 {retry?'재':""}인증
              </OneAlignedButton>
            </Grid>
            <Grid size={3} />
          </Layout>
        </Grid>
      </Layout>
    </Paper>
  );
};
export default BusinessCert;
