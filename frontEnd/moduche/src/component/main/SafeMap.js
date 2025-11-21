import { useTheme } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

const SafeMap = ({
  lat,
  lng,
  setLat,
  setLng,
  setLoca,
  markersF = [],
  markersC = [],
}) => {
  const mapRef = useRef(null); // 지도 객체 보관
  const markerRef = useRef(null); // 마커 객체 보관
  const markersFRef = useRef([]); //보조 마커
  const markersCRef = useRef([]); //보조 마커

  const theme = useTheme();

  // 처음 지도 그리기
  useEffect(() => {
    const container = document.getElementById('map');
    const { kakao } = window;
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 5,
    };

    // 지도 생성
    mapRef.current = new kakao.maps.Map(container, options);

    // 마커 생성
    markerRef.current = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      map: mapRef.current,
    });

    /** ▼▼ 지도 클릭 이벤트 추가 ▼▼ */
    kakao.maps.event.addListener(
      mapRef.current,
      'click',
      function (mouseEvent) {
        const pos = mouseEvent.latLng;
        const lat = pos.getLat();
        const lng = pos.getLng();

        // 상태 업데이트
        setLat(lat);
        setLng(lng);

        // 마커 이동
        markerRef.current.setPosition(pos);

        // 역지오코딩 → 주소 조회
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, function (res, status) {
          if (status === kakao.maps.services.Status.OK) {
            const road = res[0].road_address?.address_name;
            const jibun = res[0].address?.address_name;

            setLoca(road || jibun || '');
          }
        });
      },
    );
  }, []);

  // lat/lng가 바뀌면 지도 & 마커 위치 업데이트
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const { kakao } = window;
    const pos = new kakao.maps.LatLng(lat, lng);

    mapRef.current.setCenter(pos); // 지도 중심 이동
    markerRef.current.setPosition(pos); // 마커 이동
  }, [lat, lng]);

  // 보조 마커 찍는 함수
  const renderMarkers = (markers, markersRef, color) => {
    const { kakao } = window;
    if (!mapRef.current || !kakao) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach((m) => {
      if (!m.lat || !m.lng) return; // 좌표 없는 경우 skip
      const position = new kakao.maps.LatLng(m.lat, m.lng);
      const overlay = new kakao.maps.CustomOverlay({
        position,
        content: `<div style="
      width:24px;
      height:24px;
      background-color:${color};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 4px rgba(0,0,0,0.5);
    "></div>`,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
      overlay.setMap(mapRef.current);
      markersRef.current.push(overlay);
    });
  };

  // 시설 보조 마커
  useEffect(() => {
    renderMarkers(markersF, markersFRef, theme.palette.success.main);
  }, [markersF, mapRef.current]);

  // 커뮤니티 보조 마커
  useEffect(() => {
    renderMarkers(markersC, markersCRef, theme.palette.warning.main);
  }, [markersC, mapRef.current]);

  return (
    <div
      style={{
        width: '100%',
        display: 'inline-block',
        marginLeft: '5px',
        marginRight: '5px',
      }}
    >
      <div id="map" style={{ width: '100%', aspectRatio: '1/1' }}></div>
    </div>
  );
};
export default SafeMap;
