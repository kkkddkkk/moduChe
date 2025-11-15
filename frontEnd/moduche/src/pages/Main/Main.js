import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import Slides from '../../component/common/Slides';
import Paper from '../../component/common/Paper';
import { SubTitle } from '../../component/common/Text';
import { Handshake, MapPinned, UsersRound, Weight } from 'lucide-react';
import MapSearch from '../../component/main/MapSearch';
import { useEffect, useState } from 'react';
import SafeMap from '../../component/main/SafeMap';
import { MyPageText } from '../../component/myPage/MyPageTexts';
import CustomTable from '../../component/common/CustomTable';

const Main = () => {
  const testBannerImg = [
    { src: '/forTest/TEST_BANNER_1.png', url: '/account/login' },
    { src: '/forTest/TEST_BANNER_2.png', url: '/account/joinUs' },
    { src: '/forTest/TEST_BANNER_3.png', url: '' },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotDeskTop = useMediaQuery(theme.breakpoints.down('lg'));

  const [loca, setLoca] = useState('');
  const [lat, setLat] = useState(37.5665);
  const [lng, setLng] = useState(126.978);

  const [course, setCourse] = useState([]);
  const [community, setCommunity] = useState([]);
  const [facility, setFacility] = useState([]);

  useEffect(() => {
    console.log('lat: ' + lat);
    console.log('lng: ' + lng);
  }, [lat, lng]);

  return (
    <>
      <Layout outer space={2}>
        <Slides isBanner={true} datas={testBannerImg} />
        <Grid
          size={12}
          padding={2}
          display={'flex'}
          alignContent={'center'}
          gap={1}
          marginTop={'5%'}
        >
          <MapPinned />
          <SubTitle>내 근처에 있는...</SubTitle>
        </Grid>
        <Grid size={isMobile ? 12 : isNotDeskTop ? 6 : 4}>
          <Paper>
            <Layout space={2}>
              <MapSearch
                loca={loca}
                setLoca={setLoca}
                setLat={setLat}
                setLng={setLng}
              />
              <Grid size={12} marginTop={'5%'}>
                <SafeMap lat={lat} lng={lng} />
              </Grid>
            </Layout>
          </Paper>
        </Grid>
        <Grid size={isMobile ? 12 : isNotDeskTop ? 6 : 8}>
          <Paper>
            <Layout space={2}>
              <Grid size={12}>
                <MyPageText icon={<UsersRound />}>모집 중 강좌</MyPageText>
                {/* <CustomTable
                  
                /> */}
              </Grid>
              <Grid size={12}>
                <MyPageText icon={<Handshake />}>모집 중 동아리</MyPageText>
              </Grid>
              <Grid size={12}>
                <MyPageText icon={<Weight />}>체육 시설</MyPageText>
              </Grid>
            </Layout>
          </Paper>
        </Grid>
      </Layout>
      <Layout space={2}></Layout>
    </>
  );
};
export default Main;
