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
import { useEffect, useState } from 'react';
import CustomTextField from '../common/CustomTextField';
import EmailTest from './EmailTest';
import { getFacilityList } from '../../api/accountAPI';

const FacilityInfo = ({
  facility,
  setFacility,
  number,
  setNumber,
  numberError,
  setNumberError,
  email,
  setEmail,
  emailError,
  setEmailError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [facilities, setFacilities] = useState();
  const [search, setSearch] = useState("");

  const fetchFacility = async () => {
    const res = await getFacilityList(search);
    console.log(res);
    setFacilities(res.data);
  };

  useEffect(()=>{
    if(search.length<2){
      setFacilities([]);
      return;
    }
    fetchFacility();
  },[search]);

  // const facilities = [
  //   { name: '거지발싸개센터', loca: '서울시 거지구 발싸개동' },
  // ];

  const regPhone = /^(01[016789]\d{3,4}\d{4}|0\d{1,2}\d{3,4}\d{4})$/;
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

  return (
    <Paper>
      <Layout space={3}>
        <Grid size={12} marginBottom={'5%'}>
          <SignInText title={'시설명'} />
          <Autocomplete
            options={facilities}
            getOptionLabel={(option) => option.name.toString()} // 내부적으로 검색용
            value={
              facilities?.find((n) => n.number === facility?.number) || null
            } // value에 맞춰 객체 찾아서 전달
            onChange={(event, newValue) =>
              setSearch(newValue ? newValue : null)
            }
            filterOptions={(options, state) =>
              options.filter((opt) =>
                opt.name.toLowerCase().includes(state.inputValue.toLowerCase()),
              )
            }
            renderOption={(props, option, { index }) => (
              <li {...props} key={index}>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>{option.name}</Typography>
                  <Typography>{option.loca}</Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="클릭으로 시설명 검색"
                variant="standard"
              />
            )}
            isOptionEqualToValue={(option, val) =>
              option.number === val?.number
            }
            onInputChange={(event, newInputValue) => setSearch(newInputValue)}
            noOptionsText="등록되지 않은 시설입니다. 회원가입을 위해 국민체육진흥공단에 개별 연락 바랍니다."
          />
        </Grid>

        <Grid size={12} marginBottom={'5%'}>
          <SignInText title={'위치'} />
          <CustomTextField
            disabled={true}
            data={facility ? facility.loca : ''}
            variant={'standard'}
            placeholder={'시설명 입력 시, 위치가 자동으로 등록됩니다.'}
          />
        </Grid>

        <SignInText title={'연락처'} />
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

        <SignInText title={'이메일'} />
        <EmailTest
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
        />
      </Layout>
    </Paper>
  );
};
export default FacilityInfo;
