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
import { useEffect, useState } from 'react';
import { SmallerSubTitle } from '../common/Text';
import { StandardSelect } from '../common/CustomSelect';
import { useApi } from '../../hook/useAPI';
import Loading from '../common/Loading';
import { getDisabilityList } from '../../api/accountAPI/signInAPI';

const AdditionalInfo = ({
  disability,
  setDisability,
  degree,
  setDegree,
  additionalError,
  setAdditionalError,
  qualified,
  setQualified,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [search, setSearch] = useState('');
  const [disabilities, setDisabilities] = useState([]);

  const degrees = ['해당없음', '경증', '중증'];
  const certificated = ['가지고 있습니다.', '가지고 있지 않습니다.'];
  const [cert, setCert] = useState('');

  const { callApi: fetchDisabilityAPI, loading } = useApi(getDisabilityList);

  useEffect(() => {
    const fetchDisability = async () => {
      const res = await fetchDisabilityAPI(search);
      setDisabilities(res.data);
    };
    fetchDisability();
  }, [search]);

  useEffect(() => {
    if (cert === '가지고 있습니다.') setQualified(true);
    else setQualified(false);
  }, [cert]);

  //#region[예외처리]
  useEffect(() => {
    if (disability?.length === 0||disability===null) {
      setAdditionalError({
        message: '장애유형이 등록되지 않았습니다.',
        ready: false,
      });
      return;
    } else if (degree?.length === 0||degree===null) {
      setAdditionalError({
        message: '장애등급이 등록되지 않았습니다.',
        ready: false,
      });
      return;
    } else if (cert?.length===0 || cert===null) {
      setAdditionalError({
        message: '장애인 등록증 소지 여부가 등록되지 않았습니다.',
        ready: false,
      });
      return;
    }
    setAdditionalError({
      message: '추가정보 등록 완료!',
      ready: true,
    });
  }, [disability, degree, cert]);
  //#endregion

  return (
    <Paper>
      <Loading open={loading} text={'로딩 중입니다.'} />
      <Layout space={3}>
        <Grid size={isMobile ? 12 : 8} marginBottom={'5%'}>
          <SignInText title={'장애유형'} />
          <Autocomplete
            options={disabilities || []}
            getOptionLabel={(option) => option.name.toString()}
            value={disability || null}
            onChange={(event, newValue) =>
              setDisability(newValue ? newValue : null)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="클릭으로 장애유형 검색"
                variant="standard"
              />
            )}
            isOptionEqualToValue={(option, val) => option.name === val?.name}
            onInputChange={(event, newInputValue) => setSearch(newInputValue)}
          />
        </Grid>

        <Grid size={isMobile ? 12 : 4} marginBottom={'5%'}>
          <SignInText title={'급수'} />
          <Autocomplete
            options={degrees || []}
            value={degree || null}
            onChange={(event, newValue) => setDegree(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="클릭으로 급수 검색"
                variant="standard"
              />
            )}
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
                placeholder={'클릭으로 등록증 여부 선택'}
              ></StandardSelect>
            </Grid>
          </Layout>
        </Grid>
      </Layout>
    </Paper>
  );
};
export default AdditionalInfo;
