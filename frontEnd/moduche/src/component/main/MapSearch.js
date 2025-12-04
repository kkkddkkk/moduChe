import { Box, Divider, Grid } from '@mui/material';
import { Contents } from '../common/Text';
import CustomTextField from '../common/CustomTextField';
import { useEffect } from 'react';
import { OneAlignedButton } from '../common/Button';

const SearchMap = ({ loca, setLoca, lat, setLat, lng, setLng, disabled = true }) => {
      const handleSearchLoca = () => {
        new window.daum.Postcode({
          oncomplete: function (data) {
            // 도로명 / 지번 구분
            const mainAddress =
              data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            setLoca(mainAddress);
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

      useEffect(() => {
        const script = document.createElement('script');
        script.src =
          '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
    
        // const mapsScript = document.createElement('script');
        // mapsScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_REST_API_KEY}&libraries=services`;
        // mapsScript.async = true;
        // document.body.appendChild(mapsScript);

      }, []);
  return (
    <>
      <Grid size={8}>
        <CustomTextField
          data={loca}
          setData={setLoca}
          padding={10}
          placeholder={'주소'}
          disabled={disabled}
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
    </>
  );
};

export default SearchMap;
