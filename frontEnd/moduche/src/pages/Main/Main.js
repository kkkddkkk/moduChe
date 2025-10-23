import { Grid } from '@mui/material';
import Layout from '../../component/common/Layout';
import Slides from '../../component/common/Slides';

const Main = () => {
  const testBannerImg = [
  { src: '/forTest/TEST_BANNER_1.png', url: "/account/login"},
  { src: '/forTest/TEST_BANNER_2.png', url: "/account/joinUs" },
  { src: '/forTest/TEST_BANNER_3.png', url: "" },
];
  const testBannerImg2 = [
    `/logo/NAVER_LOGO.png`,
    `/logo/KAKAO_LOGO.png`,
    `/logo/MODUCHE_LOGO.png`,
  ];
  return (
    <Layout outer>
      <Slides isBanner={true} datas={testBannerImg}></Slides>
      <Grid size={12}>
        <Slides
          width={'20%'}
          datas={testBannerImg2}
          aspectRatio={'1/1'}
        ></Slides>
      </Grid>
    </Layout>
  );
};
export default Main;
