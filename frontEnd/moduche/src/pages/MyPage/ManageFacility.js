import { Box, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import Paper from '../../component/common/Paper';
import Loading from '../../component/common/Loading';
import MyPageButtons from '../../component/myPage/MyPageButtons';
import BusinessCert from '../../component/account/BusinessCert';
import { useEffect, useState } from 'react';
import { SetPhoneNumber } from '../../component/myPage/MyPageButtonsFields';
import { MyPageText } from '../../component/myPage/MyPageTexts';
import { Navigation, User } from 'lucide-react';
import CustomTextField from '../../component/common/CustomTextField';
import { Contents100 } from '../../component/common/Text';
import { OneAlignedButton } from '../../component/common/Button';

const ManageFacility = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));
  const accessToken = localStorage.getItem('accessToken');

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [businessNum, setBusinessNum] = useState('');

  const [loca1, setLoca1] = useState('');
  const [loca2, setLoca2] = useState('');

  const [numberError, setNumberError] = useState(false);
  const [businessAuthError, setBusinessAuthError] = useState(false);
  const [boss, setBoss] = useState('');

  const handleChangeFacility = () => {};

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSearchLoca = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 도로명 / 지번 구분
        const mainAddress =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setLoca1(mainAddress);
        // 상세주소는 유저가 입력
      },
    }).open();
  };

  return (
    <>
      <Paper>
        {/* <Loading open={loading} text="정보 수정 중입니다." /> */}
        <Layout space={3} padding={2}>
          <Grid size={12}>
            <MyPageText icon={<User />}>담당자명</MyPageText>
            <CustomTextField
              data={name}
              setData={setName}
              padding={10}
              placeholder={'담당자명'}
            />
          </Grid>
          <Grid size={12} marginTop={'5%'}>
            <SetPhoneNumber
              number={number}
              setNumber={setNumber}
              numberError={numberError}
              setNumberError={setNumberError}
            />
          </Grid>
          <Grid size={12}>
            <MyPageText icon={<Navigation />}>기관위치</MyPageText>
            <Contents100>* 주소</Contents100>
          </Grid>
          <Grid size={8}>
            <CustomTextField
              data={loca1}
              setData={setLoca1}
              padding={10}
              placeholder={'주소'}
            />
          </Grid>
          <Grid size={4}>
            <OneAlignedButton
              buttonWrapperSx={{ width: '100%' }}
              onClick={handleSearchLoca}
            >
              주소 검색
            </OneAlignedButton>
          </Grid>
          <Grid size={12} marginTop={'5%'}>
            <Contents100>* 세부 주소</Contents100>
            <CustomTextField
              rows={2}
              data={loca2}
              setData={setLoca2}
              padding={8}
              placeholder={'세부주소'}
            />
          </Grid>
        </Layout>
      </Paper>
      <Box marginTop={'5%'} />
      <BusinessCert
        businessNum={businessNum}
        setBusinessNum={setBusinessNum}
        setBusinessAuthError={setBusinessAuthError}
        businessAuthError={businessAuthError}
        boss={boss}
        setBoss={setBoss}
        retry
      />
      <MyPageButtons
        // eraseFunc={() => {
        //   setNumber(originForm.phone);
        //   setBirth(originForm.birth);
        //   setSex(originForm.sex);
        //   setMyDisability(originForm.disability);
        //   setDegree(originForm.disabilityGrade);
        //   setQualified(originForm.qualified);
        //   setNote(originForm.note);
        // }}
        saveFunc={handleChangeFacility}
      />
    </>
  );
};
export default ManageFacility;
