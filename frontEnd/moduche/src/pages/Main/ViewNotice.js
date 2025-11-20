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
import { fetchNotice } from '../../api/NoticeForAllAPI';
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

  const [list, setList] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [totalPage, setTotalPage] = useState(0);

  const { callApi: fetchNoticeAPI, loading } = useApi(fetchNotice);

  const fetch = async () => {
    const res = await fetchNoticeAPI(page - 1, rowsPerPage, keyword);
    const notices = res.data.notices;
    const mapped = notices.map((n) => ({
      noticeId: n.noticeId,
      제목: n.title,
      게시일: n.createdAt,
      조회수: n.viewCount,
      작성자: n.createdByName,
      '고정 여부': n.pinned,
    }));
    setList(mapped);
    setTotalPage(res.data.totalPages);
  };

  const handleClickNotice = (id, column, data) => {
    console.log(id);
    navigate(`/notice/view/${id}`);
  };

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 2} />}
      <Loading open={loading} text="로딩 중입니다." />
      <Grid size={isMobile ? 12 : isTablet ? 8 : 8}>
        <CenterTitle>공지사항</CenterTitle>
        <Paper>
          <Layout space={2}>
            <Grid size={12}>
              <Box
                display={'flex'}
                width={'100%'}
                justifyContent={'space-between'}
              >
                <Box>이름</Box>
                <Box>pinned 여부</Box>
              </Box>
              <Divider />
              <Box
                display={'flex'}
                width={'100%'}
                justifyContent={'space-between'}
              >
                <Box>작성자: </Box>
                <Box>작성일: </Box>
              </Box>
              <Box
                display={'flex'}
                width={'100%'}
                justifyContent={'space-between'}
              >
                <Box>조회수: </Box>
              </Box>
              <Divider />
              <Box
                display={'flex'}
                width={'100%'}
                justifyContent={'space-between'}
              >
                내용
              </Box>
              <Divider />
            </Grid>
          </Layout>
        </Paper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: 2,
            gap: 16,
            mt: '5%',
          }}
        >
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            이전 게시물
          </OneAlignedButton>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<Check size={18} />}
            onClick={() => navigate(-1)}
          >
            확인
          </OneAlignedButton>
          <OneAlignedButton
            buttonWrapperSx={{ width: '100%' }}
            buttonSx={{ padding: '8px' }}
            startIcon={<ArrowRight size={18} />}
            onClick={() => navigate(-1)}
          >
            다음 게시물
          </OneAlignedButton>
        </Box>
      </Grid>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 2} />}
    </Layout>
  );
};
export default ViewNotice;
