import {
  Autocomplete,
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Layout from '../common/Layout';
import Paper from '../common/Paper';
import { SignInText } from './SignInText';
import { useState } from 'react';
import { SmallerSubTitle } from '../common/Text';
import { StandardSelect } from '../common/CustomSelect';

const AdditionalInfo = ({ disability, setDisability, degree, setDegree }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const disabilities = ['장애', '장애장애', '장애장애장애'];
  const degrees = ['1급', '2급', '3급'];
  const certificated = ['가지고 있습니다.', '가지고 있지 않습니다.'];

  const [cert, setCert] = useState('가지고 있습니다.');

  return (
    <Paper>
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
            <Grid size={isMobile ? 12 : 4}>
              <SmallerSubTitle
                color={theme.palette.text.primary}
                sx={{ textAlign: isMobile ? 'auto' : 'center' }}
              >
                저는 장애인 등록증을
              </SmallerSubTitle>
            </Grid>
            <Grid size={isMobile ? 12 : 8}>
              <StandardSelect
                data={certificated}
                selected={cert}
                setSelected={setCert}
              ></StandardSelect>
            </Grid>
          </Layout>
        </Grid>
      </Layout>
    </Paper>
  );
};
export default AdditionalInfo;
