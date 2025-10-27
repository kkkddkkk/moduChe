import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../component/common/Layout';
import Paper from '../../component/common/Paper';
import {
  CenterTitle,
  SmallerSubTitle,
  SubTitle,
} from '../../component/common/Text';
import { HousePlus, UserRoundPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JoinUs = () => {
  const theme = useTheme();
  const main = theme.palette.primary.main;
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const SelectJoinButton = ({ role, children, icon, joinRole }) => {
    return (
      <Grid
        size={isMobile || isTablet ? 12 : 6}
        sx={{
          cursor: 'pointer',
        }}
      >
        <Paper
          hoverable
          elevation={6}
          onClick={() => {
            navigate(`/account/signIn?role=${joinRole}`);
          }}
          sx={{
            cursor: 'pointer',
          }}
        >
          <Layout>
            <Grid size={12}>
              <CenterTitle>{role}</CenterTitle>
              {children}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '5% 0',
                }}
              >
                {icon}
              </Box>
            </Grid>
          </Layout>
        </Paper>
      </Grid>
    );
  };
  return (
    <Layout space={0}>
      {isMobile ? <></> : <Grid size={2} />}
      <Grid size={isMobile ? 12 : 8}>
        <CenterTitle>회원가입</CenterTitle>
        <SubTitle sx={{ textAlign: 'center' }} margin="0 0 5% 0">
          먼저, 역할을 선택해주세요.
        </SubTitle>
        <Layout space={4}>
          <SelectJoinButton
            role={'개인'}
            icon={<UserRoundPlus size={120} color={main} />}
            joinRole={'individual'}
          >
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              <span style={{ color: main }}>나에게 맞는 운동</span>을 추천받을
              수 있습니다.
            </SmallerSubTitle>
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              <span style={{ color: main }}>새로운 체육 강좌</span>를 신청할 수
              있습니다.
            </SmallerSubTitle>
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              <span style={{ color: main }}>새로운 체육 동아리</span>에 참여할
              수 있습니다.
            </SmallerSubTitle>
          </SelectJoinButton>

          <SelectJoinButton
            role={'기관'}
            icon={<HousePlus size={120} color={theme.palette.primary.main} />}
            joinRole={'agency'}
          >
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              장애인 체육 강좌를 등록할 수 있습니다.
            </SmallerSubTitle>
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              기관 정보를 손쉽게 관리할 수 있습니다.
            </SmallerSubTitle>
            <SmallerSubTitle sx={{ textAlign: 'center' }}>
              수강 신청 현황을 실시간으로 확인할 수 있습니다.
            </SmallerSubTitle>
          </SelectJoinButton>
        </Layout>
      </Grid>
      {isMobile ? <></> : <Grid size={2} />}
    </Layout>
  );
};
export default JoinUs;
