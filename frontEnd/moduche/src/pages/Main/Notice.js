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
import { useNavigate } from 'react-router-dom';
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
import { SearchIcon, Star } from 'lucide-react';

const Notice = () => {
  //HOOK 정의
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

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

  useEffect(() => {
    fetch();
  }, [page]);

  const handleRefresh = () => {
    fetch();
  };

  const formateDate = (data) => {
    return dateFormat(data);
  };

  const formatPinned = (data) => {
    return data ? (
      <Box width={'100%'} display={'flex'} justifyContent={'center'}>
        <Star
          color={theme.palette.warning.main}
          fill={theme.palette.warning.main}
        />
      </Box>
    ) : (
      <></>
    );
  };

  const handleClickNotice = (id, column, data) => {
    navigate(`/notice/view/${id}`);
  };

  return (
    <Layout padding={2}>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 2} />}
      <Loading open={loading} text="로딩 중입니다." />
      <Grid size={isMobile ? 12 : isTablet ? 8 : 8}>
        <CenterTitle>공지사항</CenterTitle>
        <Box
          marginBottom={'2%'}
          display={'flex'}
          width={'100%'}
          justifyContent={'space-between'}
        >
          <Layout space={2}>
            <Grid size={isMobile ? 12 : isTablet ? 8 : 10} marginBottom={'2%'}>
              <TextField
                size="small"
                placeholder="제목 / 내용 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                    backgroundColor: 'background.paper',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.light',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: 'text.disabled',
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={isMobile ? 12 : isTablet ? 4 : 2} marginBottom={'2%'}>
              <OneAlignedButton
                buttonWrapperSx={{ width: '100%' }}
                onClick={handleRefresh}
              >
                검색
              </OneAlignedButton>
            </Grid>
          </Layout>

          {/* <Button variant="contained" onClick={handleRefresh}>
            검색
          </Button> */}
        </Box>
        <CustomTable
          datas={list}
          columns={['제목', '게시일', '조회수', '작성자', '고정 여부']}
          widths={['50', '20', '10', '10', '10']}
          formatter={[
            { 게시일: formateDate },
            { '고정 여부': formatPinned },
            // { tempColumn4: format4 },
          ]}
          hover={['제목', '게시일', '조회수', '작성자', '고정 여부']}
          clickEvent={handleClickNotice}
          id={'noticeId'}
          padding={1}
          hoverColor={theme.palette.text.primary}
        />

        {/* 페이지네이션 */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPage}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        </Stack>
      </Grid>
      {isMobile ? <></> : <Grid size={isTablet ? 2 : 2} />}
    </Layout>
  );
};
export default Notice;
