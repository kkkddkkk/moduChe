import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import Layout from "../../component/common/Layout";
import Slides from "../../component/common/Slides";
import Paper from "../../component/common/Paper";
import { SubTitle } from "../../component/common/Text";
import { Handshake, MapPinned, Weight } from "lucide-react";
import MapSearch from "../../component/main/MapSearch";
import { useEffect, useState } from "react";
import SafeMap from "../../component/main/SafeMap";
import { MyPageText } from "../../component/myPage/MyPageTexts";
import CustomTable from "../../component/common/CustomTable";
import { getList } from "../../api/DistanceAPI";
import { useApi } from "../../hook/useAPI";
import { useNavigate } from "react-router-dom";
import { fetchMainBanners } from "../../api/bannerAPI/bannerAPI";

const Main = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNotDeskTop = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const testBannerImg = [
    { src: "/forTest/TEST_BANNER_1.png", url: "/account/login" },
    { src: "/forTest/TEST_BANNER_2.png", url: "/account/joinUs" },
    { src: "/forTest/TEST_BANNER_3.png", url: "" },
  ];

  const [loca, setLoca] = useState("");
  const [lat, setLat] = useState(37.5665);
  const [lng, setLng] = useState(126.978);

  const [community, setCommunity] = useState([]);
  const [facility, setFacility] = useState([]);
  const [communityMark, setCommunityMark] = useState([]);
  const [facilityMark, setFacilityMark] = useState([]);

  const [banners, setBanners] = useState([]);

  const distanceFormat = (m) => {
    if (m >= 1000) {
      return `약 ${(m / 1000).toFixed(1)}km`;
    } else {
      return `약 ${m?.toFixed(0)}m`;
    }
  };

  function phoneFormat(numbers) {
    numbers = numbers?.replace(/\D/g, "");

    if (numbers?.startsWith("01")) {
      return numbers?.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
    } else if (numbers?.startsWith("02")) {
      return numbers?.replace(/^(\d{2})(\d{3,4})(\d{4})$/, "$1-$2-$3");
    } else {
      return numbers?.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
    }
  }

  const { callApi: getListAPI } = useApi(getList);

  useEffect(() => {
    const fetch = async () => {
      const res = await getListAPI(lat, lng);
      const data = res.data;

      const communities = data.communities.map((c) => ({
        communityId: c.communityId,
        동아리명: c.name,
        목적: c.purpose,
        거리: distanceFormat(c.distance),
        담당기관: c.founder,
        활동일: c.scheduleDetail,
      }));
      const markC = data.communities.map((c) => ({
        lat: c.geoLat,
        lng: c.geoLng,
        name: c.name,
      }));

      const facilities = data.facilities.map((f) => ({
        facilityId: f.facilityId,
        기관명: f.facilityName,
        종목: f.facilityType,
        거리: distanceFormat(f.distance),
        영업시간: f.openHours || "전화 문의",
        연락처: phoneFormat(f.facilityPhone),
        lat: f.geoLat,
        lng: f.geoLng,
      }));
      const markF = data.facilities.map((f) => ({
        lat: f.geoLat,
        lng: f.geoLng,
        name: f.facilityName,
      }));

      setCommunity(communities);
      setFacility(facilities);
      setCommunityMark(markC);
      setFacilityMark(markF);
    };
    fetch();
  }, [lat, lng, getListAPI]);

  // 작성자: 고은설.
  // 기능: 메인 페이지 로드와 함께 가점 상위 3개 메인 배너 조회.
  useEffect(() => {
    (async () => {
      const data = await fetchMainBanners();
      setBanners(data);
    })();
  }, []);

  const handleFacilityClick = () => {
    navigate("/course");
  };

  /** ✅ 동아리 테이블: 아무 셀이나 클릭하면 동아리 게시판으로 이동 */
  const handleCommunityClick = () => {
    navigate("/community/home");
  };

  return (
    <>
      <Layout outer space={2}>
        <Slides
          isBanner={true}
          datas={banners.length > 0 ? banners : testBannerImg}
        />

        <Grid
          size={12}
          padding={2}
          display={"flex"}
          alignContent={"center"}
          gap={1}
          marginTop={"5%"}
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
              <Grid size={12} marginTop={"5%"}>
                <SafeMap
                  lat={lat}
                  lng={lng}
                  setLoca={setLoca}
                  setLat={setLat}
                  setLng={setLng}
                  markersC={communityMark}
                  markersF={facilityMark}
                />
              </Grid>
            </Layout>
          </Paper>
        </Grid>

        <Grid size={isMobile ? 12 : isNotDeskTop ? 6 : 8}>
          <Paper sx={{ marginBottom: "5%" }}>
            <Layout space={2}>
              {/* 체육 시설 */}
              <Grid size={12}>
                <MyPageText icon={<Weight />}>체육 시설</MyPageText>
                <Box marginTop={"2%"} />
                <CustomTable
                  datas={facility}
                  columns={["기관명", "종목", "거리", "영업시간", "연락처"]}
                  id="facilityId"
                  padding={1}
                  hover={["기관명", "종목", "거리", "영업시간", "연락처"]}
                  hoverColor={theme.palette.text.primary}
                  clickEvent={handleFacilityClick}
                />
              </Grid>

              <Box marginTop={"5%"} />

              {/* 모집 중 동아리 */}
              <Grid size={12}>
                <MyPageText icon={<Handshake />}>모집 중 동아리</MyPageText>
                <Box marginTop={"2%"} />
                <CustomTable
                  datas={community}
                  columns={["동아리명", "목적", "거리", "담당기관", "활동일"]}
                  id="communityId"
                  padding={1}
                  hover={["동아리명", "목적", "거리", "담당기관", "활동일"]}
                  hoverColor={theme.palette.text.primary}
                  clickEvent={handleCommunityClick}
                />
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
