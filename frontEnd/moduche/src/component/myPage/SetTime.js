import { Box, Grid } from '@mui/material';
import { SubTitle } from '../common/Text';
import Layout from '../common/Layout';
import { StandardSelect } from '../common/CustomSelect';

const SetTime = ({
  selectedTime,
  setSelectedTime,
  selectedMinute,
  setSelectedMinute,
}) => {
  const timeData = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ];

  const minuteData = [
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ];
  return (
    <Layout space={2}>
      <Grid size={5.5}>
        <StandardSelect
          data={timeData}
          selected={selectedTime}
          setSelected={setSelectedTime}
          placeholder={"시간"}
        />
      </Grid>
      <Grid size={1}>
        <SubTitle sx={{ textAlign: 'center' }}>:</SubTitle>
      </Grid>
      <Grid size={5.5}>
        <StandardSelect
          data={minuteData}
          selected={selectedMinute}
          setSelected={setSelectedMinute}
          placeholder={"분"}
        />
      </Grid>
    </Layout>
  );
};

export default SetTime;
