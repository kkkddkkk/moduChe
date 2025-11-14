import { Box, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import Paper from '../../component/common/Paper';
import Loading from '../../component/common/Loading';
import MyPageButtons from '../../component/myPage/MyPageButtons';
import BusinessCert from '../../component/account/BusinessCert';
import { useEffect, useState } from 'react';
import { SetPhoneNumber } from '../../component/myPage/MyPageButtonsFields';
import { MyPageText } from '../../component/myPage/MyPageTexts';
import {
  Clock,
  Eye,
  EyeOff,
  FileText,
  Home,
  Navigation,
  Tags,
  User,
} from 'lucide-react';
import CustomTextField from '../../component/common/CustomTextField';
import {
  Contents100,
  SmallerSubTitle,
  SubTitle,
} from '../../component/common/Text';
import { OneAlignedButton } from '../../component/common/Button';
import { NormalModal } from '../../component/common/Modals';
import SetTime from '../../component/myPage/SetTime';
import { getFacility, setFacility } from '../../api/accountAPI/MyPageAPI';
import { useApi } from '../../hook/useAPI';
import { getUsernameFromToken } from '../../utils/auth';

const ManageFacility = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down('md'));
  const accessToken = localStorage.getItem('accessToken');

  const [originForm, setOriginForm] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [tags, setTags] = useState('');
  const [businessNum, setBusinessNum] = useState('');
  const [newBusinessNum, setNewBusinessNum] = useState('');
  const [loca1, setLoca1] = useState('');
  const [loca2, setLoca2] = useState('');
  const [lat, setLat] = useState(-1);
  const [lng, setLng] = useState(-1);
  const [boss, setBoss] = useState('');
  const [newBoss, setNewBoss] = useState('');
  const [accessibility, setAccessibility] = useState('');

  const [changeFacility, setChangeFacility] = useState(false);

  const [numberError, setNumberError] = useState(false);
  const [businessAuthError, setBusinessAuthError] = useState(null);

  const [show, setShow] = useState(false);

  const [openTime, setOpenTime] = useState('09');
  const [openMinute, setOpenMinute] = useState('00');
  const [closeTime, setCloseTime] = useState('18');
  const [closeMinute, setCloseMinute] = useState('00');

  const formatBusinessNum = (bn) => {
    const formatted = `${bn.slice(0, 3)}-${bn.slice(3, 5)}-${bn.slice(5, 10)}`;
    return formatted;
  };

  const formatSecretBusinessNum = (bn) => {
    const formatted = `${bn.slice(0, 3)}-${bn.slice(3, 5)}-*****`;
    return formatted;
  };

  //#region
  const handleSearchLoca = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 도로명 / 지번 구분
        const mainAddress =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setLoca1(mainAddress);
        // 상세주소는 유저가 입력
        setLoca2('');
        getCoords(mainAddress);
      },
    }).open();
  };

  const getCoords = async (address) => {
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
          address,
        )}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
          },
        },
      );
      if (!res.ok) throw new Error('Kakao API 요청 실패');

      const data = await res.json();

      // documents 존재 여부 확인
      if (data?.documents?.length > 0) {
        const { x, y } = data.documents[0]; // y: 경도, x: 위도
        setLat(y);
        setLng(x);
        return null;
      } else {
        console.warn('주소에 대한 좌표가 없습니다.', address);
        return null;
      }
    } catch (err) {
      console.error('getCoords 오류:', err);
      return null;
    }
  };
  //#endregion

  const { callApi: getFacilityAPI } = useApi(getFacility);
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    const mapsScript = document.createElement('script');
    mapsScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_REST_API_KEY}&libraries=services`;
    mapsScript.async = true;
    document.body.appendChild(mapsScript);

    const fetchFacility = async () => {
      const res = await getFacilityAPI(getUsernameFromToken(accessToken));
      const data = res.data;
      setName(data.roleInFac || '');
      setNumber(data.phone);
      setTags(data.facilityType);
      setBusinessNum(data.businessNum);
      setLoca2(data.facilityAddress);
      setBoss(data.boss);
      setAccessibility(data.accessibilityFeatures || '');
      setLat(data.geoLat);
      setLng(data.geoLng);
      const origin = {
        name: data.roleInFac || '',
        number: data.phone,
        tags: data.facilityType,
        businessNum: data.businessNum,
        loca1: '',
        loca2: data.facilityAddress,
        lat: data.geoLat,
        lng: data.geoLng,
        boss: data.boss,
        accessibility: data.accessibilityFeatures || '',
      };
      if (data.openHours !== null) {
        const [start, end] = data.openHours.split('-'); // ["09:30", "18:45"]

        const [ot, om] = start.split(':'); // ot=9, om=30
        const [ct, cm] = end.split(':');

        setOpenTime(ot);
        setOpenMinute(om);
        setCloseTime(ct);
        setCloseMinute(cm);
        origin.openTime = ot;
        origin.openMinute = om;
        origin.closeTime = ct;
        origin.closeMinute = cm;
      }
      setOriginForm(origin);
    };
    fetchFacility();
  }, []);

  useEffect(() => {
    if (businessAuthError === null) return;
    if (businessAuthError.ready) {
      setBusinessNum(newBusinessNum);
      setBoss(newBoss);
    }
  }, [businessAuthError]);

  const {
    callApi: setFacilityAPI,
    loading,
    done,
    setDone,
  } = useApi(setFacility);
  
  const handleChangeFacility = async () => {
    const dto = {
      username: getUsernameFromToken(accessToken),
      roleInFac: name,
      phone: number,
      facilityType: tags,
      facilityAddress: `${loca1} ${loca2}`,
      geoLat: lat,
      geoLng: lng,
      openHours: `${openTime}:${openMinute}-${closeTime}:${closeMinute}`,
      businessNum: businessNum,
      boss: boss,
      accessibilityFeatures: accessibility,
    };
    await setFacilityAPI(dto);
    setOriginForm({
      name: name,
      number: number,
      tags: tags,
      loca1: loca1,
      loca2: loca2,
      lat: lat,
      lng: lng,
      openTime: openTime,
      openMinute: openMinute,
      closeTime: closeTime,
      closeMinute: closeMinute,
      businessNum: businessNum,
      boss: boss,
      accessibilityFeatures: accessibility,
    });
  };

  useEffect(() => {
    if (!done) return;
    alert('시설 정보 변경이 완료되었습니다.');
    setDone(false);
  }, [done]);

  return (
    <>
      <Paper>
        <Loading open={loading} text="정보 수정 중입니다." />
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
            <MyPageText icon={<Tags />}>시설종목</MyPageText>
            <CustomTextField
              data={tags}
              setData={setTags}
              padding={10}
              placeholder={'종목'}
            />
          </Grid>
          <Grid size={12} marginTop={'5%'}>
            <MyPageText icon={<Navigation />}>시설위치</MyPageText>
            <Contents100>* 주소</Contents100>
          </Grid>
          <Grid size={8}>
            <CustomTextField
              data={loca1}
              setData={setLoca1}
              padding={10}
              placeholder={'주소'}
              disabled={true}
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
          <Grid size={12} marginTop={'5%'}>
            <MyPageText icon={<Clock />}>영업시간</MyPageText>
            <Layout space={2}>
              <Grid size={5.5}>
                <SetTime
                  selectedTime={openTime}
                  setSelectedTime={setOpenTime}
                  selectedMinute={openMinute}
                  setSelectedMinute={setOpenMinute}
                />
              </Grid>
              <Grid size={1}>
                <SubTitle sx={{ textAlign: 'center' }}>~</SubTitle>
              </Grid>
              <Grid size={5.5}>
                <SetTime
                  selectedTime={closeTime}
                  setSelectedTime={setCloseTime}
                  selectedMinute={closeMinute}
                  setSelectedMinute={setCloseMinute}
                />
              </Grid>
            </Layout>
          </Grid>
        </Layout>
      </Paper>

      <NormalModal
        open={changeFacility}
        close={() => setChangeFacility(false)}
        title={'사업자 변경'}
      >
        <BusinessCert
          businessNum={newBusinessNum}
          setBusinessNum={setNewBusinessNum}
          setBusinessAuthError={setBusinessAuthError}
          businessAuthError={businessAuthError}
          boss={newBoss}
          setBoss={setNewBoss}
        />
      </NormalModal>
      <Paper>
        <Layout space={2} padding={2}>
          <MyPageText icon={<Home />}>사업자 정보</MyPageText>
          <Box marginTop={'5%'} />
          <Contents100>* 사업자등록번호</Contents100>
          <Grid size={isMobile ? 10 : 11}>
            <CustomTextField
              data={
                show
                  ? formatBusinessNum(businessNum)
                  : formatSecretBusinessNum(businessNum)
              }
              setData={setBusinessNum}
              padding={10}
              disabled={true}
            />
          </Grid>
          <Grid size={isMobile ? 2 : 1}>
            {show ? (
              <EyeOff
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow(false)}
                cursor={'pointer'}
              />
            ) : (
              <Eye
                style={{ margin: 'auto 0' }}
                size={30}
                onClick={() => setShow(true)}
                cursor={'pointer'}
              />
            )}
          </Grid>
          <Grid size={12} marginTop={'5%'}>
            <Contents100>* 대표자명</Contents100>
            <CustomTextField
              data={boss}
              setData={setBoss}
              padding={10}
              disabled={true}
            />
          </Grid>
          <Grid size={8} marginTop={'5%'} />
          <Grid size={4} marginTop={'5%'}>
            <OneAlignedButton
              buttonWrapperSx={{ width: '100%' }}
              onClick={() => setChangeFacility(true)}
            >
              변경하기
            </OneAlignedButton>
          </Grid>
        </Layout>
      </Paper>

      <Box marginTop={'5%'} />
      <Paper>
        <Layout space={2} padding={2}>
          <Grid size={12}>
            <MyPageText icon={<FileText />}>추가 정보</MyPageText>
            <Contents100 color={'text.secondary'}>
              * 시설의 접근성에 대한 추가 정보(경사로, 리프트 등)를
              작성해주세요.
            </Contents100>
            <CustomTextField
              rows={10}
              data={accessibility}
              setData={setAccessibility}
              padding={8}
              placeholder={
                '시설의 편의시설에 대한 추가 정보(경사로, 리프트 등)를 작성해주세요.'
              }
            />
          </Grid>
        </Layout>
      </Paper>
      <MyPageButtons
        eraseFunc={() => {
          setName(originForm.name);
          setNumber(originForm.number);
          setTags(originForm.tags);
          setBusinessNum(originForm.businessNum);
          setLoca1(originForm.loca1);
          setLoca2(originForm.loca2);
          setBoss(originForm.boss);
          setAccessibility(originForm.accessibility);
          setOpenTime(originForm.openTime);
          setOpenMinute(originForm.openMinute);
          setCloseTime(originForm.closeTime);
          setCloseMinute(originForm.closeMinute);
          setLat(originForm.lat);
          setLng(originForm.lng);
        }}
        saveFunc={handleChangeFacility}
      />
    </>
  );
};
export default ManageFacility;
