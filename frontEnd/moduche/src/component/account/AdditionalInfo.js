import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import { SignInText } from './SignInText';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomTextField from '../common/CustomTextField';
import { SmallerSubTitle } from '../common/Text';
import { StandardSelect } from '../common/CustomSelect';

const AdditionalInfo = ({ disability, setDisability, degree, setDegree }) => {
  const [searchParam] = useSearchParams();
  const signRole = searchParam.get('role');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const disabilities = ['장애', '장애장애', '장애장애장애'];
  const degrees = ['1급', '2급', '3급'];
  const certificated = ['가지고 있습니다.', '가지고 있지 않습니다.'];

  const agencies = [{ number: 12345, name: '거지발싸개센터', loca: '서울시 거지구 발싸개동' }];

  const [cert, setCert] = useState('가지고 있습니다.');
  const [agency, setAgency] = useState(null);
  const [loca, setLoca] = useState('');

  const formatCert = (data) => {
    if (data) {
      return '가지고 있습니다.';
    } else {
      return '가지고 있지 않습니다.';
    }
  };

  useEffect(()=>{
    if(agency===null) return;
    console.log(agency);
  },[agency])

  return (
    <Paper>
      {signRole === 'individual' ? (
        <Layout space={3}>
          <Grid size={isMobile ? 12 : 8} marginBottom={'5%'}>
            <SignInText title={'장애유형'} />
            <Autocomplete
              options={disabilities}
              value={disability}
              onChange={(event, newValue) => setDisability(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="클릭으로 장애유형 검색"
                  variant="standard"
                />
              )}
              freeSolo // 입력한 값도 허용
            />
          </Grid>

          <Grid size={isMobile ? 12 : 4} marginBottom={'5%'}>
            <SignInText title={'급수'} />
            <Autocomplete
              options={degrees}
              value={degree}
              onChange={(event, newValue) => setDegree(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="클릭으로 급수 검색"
                  variant="standard"
                />
              )}
              freeSolo // 입력한 값도 허용
            />
          </Grid>

          <Grid size={12} marginBottom={'5%'}>
            <SignInText title={'장애 등록 여부'} />
            <Layout>
              <Grid size={4}>
                <SmallerSubTitle
                  color={theme.palette.text.primary}
                  sx={{ textAlign: 'center' }}
                >
                  저는 장애인 등록증을
                </SmallerSubTitle>
              </Grid>
              <Grid size={8}>
                <StandardSelect
                  data={certificated}
                  selected={cert}
                  setSelected={setCert}
                ></StandardSelect>
              </Grid>
            </Layout>
          </Grid>
        </Layout>
      ) : (
        <></>
      )}
      {signRole === 'agency' ? (
        <Layout space={3}>
          <Grid size={12} marginBottom={'5%'}>
            <SignInText title={'사업자등록번호'} />
            <Autocomplete
              options={agencies}
              getOptionLabel={(option) => option.number.toString()} // 내부적으로 검색용
              value={agencies.find((n) => n.number === agency?.number) || null} // value에 맞춰 객체 찾아서 전달
              onChange={(event, newValue) =>
                setAgency(newValue ? newValue : null)
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>{option.number}</Typography>
                    <Typography>{option.name}</Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder="클릭으로 사업자등록번호 검색" variant="standard" />
              )}
              isOptionEqualToValue={(option, val) =>
                option.number === val?.number
              }
              noOptionsText="등록되지 않은 번호입니다. 회원가입을 위해 국민체육진흥공단에 개별 연락 바랍니다."
            />
          </Grid>

          <Grid size={12} marginBottom={'5%'}>
            <SignInText title={'위치'} />
            <CustomTextField
              disabled={true}
              data={agency?.loca}
              variant={"standard"}
              placeholder={"사업자 번호 입력 시, 위치가 자동으로 등록됩니다."}
            />
          </Grid>
        </Layout>
      ) : (
        <></>
      )}
    </Paper>
  );
};
export default AdditionalInfo;
