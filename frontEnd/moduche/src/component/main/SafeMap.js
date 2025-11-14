import { useEffect, useRef, useState } from 'react';

const SafeMap = ({ lat, lng }) => {
  const mapRef = useRef(null); // 지도 객체 보관
  const markerRef = useRef(null); // 마커 객체 보관

  // 처음 지도 그리기
  useEffect(() => {
    const container = document.getElementById('map');
    const { kakao } = window;
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    // 지도 생성
    mapRef.current = new kakao.maps.Map(container, options);

    // 마커 생성
    markerRef.current = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      map: mapRef.current,
    });
  }, []);

  // lat/lng가 바뀌면 지도 & 마커 위치 업데이트
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const { kakao } = window;
    const pos = new kakao.maps.LatLng(lat, lng);

    mapRef.current.setCenter(pos); // 지도 중심 이동
    markerRef.current.setPosition(pos); // 마커 이동
  }, [lat, lng]);

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
