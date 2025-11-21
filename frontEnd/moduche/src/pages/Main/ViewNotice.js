import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Layout from '../../component/common/Layout';
import CustomTextField from '../../component/common/CustomTextField';
import { useEffect, useState } from 'react';
import { OneAlignedButton } from '../../component/common/Button';
import {
  CenterTitle,
  Contents,
  Contents100,
} from '../../component/common/Text';
import { useNavigate, useParams } from 'react-router-dom';
import KakaoLoginButton from '../../component/account/KakaoLoginButton';
import NaverLoginButton from '../../component/account/NaverLoginButton';
import GoogleLoginButton from '../../component/account/GoogleLoginButton';
import { useApi } from '../../hook/useAPI';
import Loading from '../../component/common/Loading';
import { useUser } from '../../context/UserContext';
import { logIn } from '../../api/accountAPI/AuthAPI';
import CustomTable from '../../component/common/CustomTable';
import { fetchNotice, fetchNoticeDetail } from '../../api/NoticeForAllAPI';
import { dateFormat } from '../../component/common/Functions';
import { ArrowLeft, ArrowRight, Check, SearchIcon, Star } from 'lucide-react';
import Paper from '../../component/common/Paper';

const ViewNotice = () => {
  //HOOK 정의
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const { noticeId } = useParams();

  const [form, setForm] = useState(null);

  const [prevDisable, setPrevDisable] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);

  const { callApi: fetchNoticeAPI, loading } = useApi(fetchNoticeDetail);

  const fetch = async () => {
    const res = await fetchNoticeAPI(noticeId);
    setForm(res.data);
    if (res.data.prevId === null) setPrevDisable(true);
    else setPrevDisable(false);
    if (res.data.nextId === null) setNextDisable(true);
    else setNextDisable(false);
  };

  useEffect(() => {
    fetch();
  }, [noticeId]);

  const formatPinned = (data) => {
    return data ? (
      <Box>
        <Star
          color={theme.palette.warning.main}
          fill={theme.palette.warning.main}
        />
      </Box>
    ) : (
      <></>
    );
  };

  const NoticeBox = ({ children, sub }) => {
    return (
      <Box
        display={'flex'}
        width={'100%'}
        justifyContent={'space-between'}
        padding={sub ? '0 2% 2% 2%' : '2%'}
      >
        {children}
      </Box>
    );
  };

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 3} />}
      <Loading open={loading} text="로딩 중입니다." />
      <Grid size={isMobile ? 12 : isTablet ? 8 : 6} marginBottom={'5%'}>
        <CenterTitle>공지사항</CenterTitle>
        <Paper>
          <Layout space={2}>
            <Grid size={12}>
              <NoticeBox>
                <Contents>제목: {form?.title}</Contents>
                {formatPinned(form?.isPinned)}
              </NoticeBox>
              <Divider />
              <NoticeBox>
                <Contents>작성자: {form?.createdByName}</Contents>
                <Contents>작성일: {dateFormat(form?.createdAt)}</Contents>
              </NoticeBox>
              <NoticeBox sub>
                <Contents>조회수: {form?.viewCount}</Contents>
              </NoticeBox>
              <Divider />
              <NoticeBox>
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: theme.palette.background.default,
                    minHeight: '30vh',
                    borderRadius: '10px',
                    padding: '5%',
                  }}
                >
                  {form?.imgUrls.map((url) => (
                    <Box
                      sx={{ width: '100%', marginBottom: '5%' }}
                      component={'img'}
                      src={url}
                    />
                  ))}

                  <Box
                    dangerouslySetInnerHTML={{ __html: form?.content || '' }}
                  />
                </Box>
              </NoticeBox>
            </Grid>
          </Layout>
        </Paper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: 2,
            gap: isMobile ? 1 : isTablet ? 4 : 16,
            mt: '5%',
          }}
        >
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(`/notice/view/${form?.prevId}`)}
            disabled={prevDisable}
          >
            이전 게시물
          </OneAlignedButton>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<Check size={18} />}
            onClick={() => navigate(`/notice`)}
          >
            목록으로
          </OneAlignedButton>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<ArrowRight size={18} />}
            onClick={() => navigate(`/notice/view/${form?.nextId}`)}
            disabled={nextDisable}
          >
            다음 게시물
          </OneAlignedButton>
        </Box>
      </Grid>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 3} />}
    </Layout>
  );
};
export default ViewNotice;
