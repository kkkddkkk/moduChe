import { useEffect, useRef, useState } from 'react';
import { useApi } from '../../hook/useAPI';
import { getList } from '../../api/DistanceAPI';

const DistanceCalc = ({ lat, lng }) => {
  const { callApi: getListAPI, loading } = useApi(getList);
  const fetch = () => {
    const res = getListAPI(lat, lng);
  };
  useEffect(() => {
    fetch();
  }, []);

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
export default DistanceCalc;
