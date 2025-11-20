// src/pages/Admin/FacilityPage.js
import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  InputAdornment,
  Button,
  Divider,
  useTheme,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/AddBusiness';

import Paper from '../../component/common/Paper';
import { fetchNotice } from '../../api/admin/NoticeAPI';
import { useApi } from '../../hook/useAPI';
import { dateFormat } from '../../component/common/Functions';

function FacilityPage() {
  // DB에서 가져올 시설 리스트
  const [list, setList] = useState([]);
  const theme = useTheme();

  // 라벨 매핑
  const STATUS_LABEL = {
    PINNED: '상단 고정',
    ACTIVATED: '일반',
    DEACTIVATED: '비활성화',
  };

  const STATUS_COLOR = {
    PINNED: 'warning',
    ACTIVATED: 'text.primary',
    DEACTIVATED: 'error',
  };

  const customStatus = (isPinned, isVisible) => {
    if (isPinned) return 'PINNED';
    else return isVisible ? 'ACTIVATED' : 'DEACTIVATED';
  };

  // 필터 상태
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // 페이지네이션
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [totalPage, setTotalPage] = useState(0);

  const { callApi: fetchNoticeAPI } = useApi(fetchNotice);
  const fetch = async () => {
    let isVisible = null;
    let isPinned = null;
    switch (statusFilter) {
      case 'PINNED': {
        isVisible = true;
        isPinned = true;
        break;
      }
      case 'ACTIVATED': {
        isVisible = true;
        isPinned = false;
        break;
      }
      case 'DEACTIVATED': {
        isVisible = false;
        isPinned = false;
        break;
      }
    }
    const res = await fetchNoticeAPI(
      page - 1,
      rowsPerPage,
      keyword,
      isVisible,
      isPinned,
    );
    const content = res.data.notices;
    setList(content);
    setTotalPage(res.data.totalPages);
  };
  useEffect(() => {
    fetch();
  }, [page]);

  const handleRefresh = () => {
    fetch();
  };

  // 새 시설 등록 팝업
  const handleCreateOrUpdateNotice = (update = false, noticeId) => {
    const w = 900;
    const h = 640;

    const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
    const dualScreenTop = window.screenTop ?? window.screenY ?? 0;

    const viewportW =
      window.innerWidth ??
      document.documentElement?.clientWidth ??
      window.screen?.width ??
      0;
    const viewportH =
      window.innerHeight ??
      document.documentElement?.clientHeight ??
      window.screen?.height ??
      0;

    const availW = (window.screen?.availWidth ?? viewportW) || 1;
    const systemZoom = viewportW / availW;

    const left = (viewportW - w) / 2 / (systemZoom || 1) + dualScreenLeft;
    const top = (viewportH - h) / 2 / (systemZoom || 1) + dualScreenTop;

    window.open(
      `/admin-window/notices/${update ? `update/${noticeId}` : 'new'}`,
      'NoticeCreateWindow',
      `scrollbars=yes,width=${w},height=${h},top=${top},left=${left},noopener,noreferrer`,
    );
  };

  // 리스트에서 facilityId로 찾아서 상세 다이얼로그 오픈
  const handleView = (noticeId) => {
    handleCreateOrUpdateNotice(true, noticeId);
  };

  // 팝업에서 오는 postMessage 수신 → 리스트에 추가
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data || {};
      if (type === 'FACILITY_CREATED' && payload) {
        setList((prev) => {
          const dup = prev.some(
            (f) => String(f.facilityId) === String(payload.facilityId),
          );
          return dup ? prev : [payload, ...prev];
        });
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // 필터링
  const filteredList = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return (list || []).filter((row) => {
      const name = row.facilityName || '';
      const addr = row.facilityAddress || '';
      const idStr = row.facilityId != null ? String(row.facilityId) : '';

      const matchKeyword =
        kw === '' ||
        name.toLowerCase().includes(kw) ||
        addr.toLowerCase().includes(kw) ||
        idStr.toLowerCase().includes(kw);

      const matchStatus =
        statusFilter === 'ALL' ? true : row.status === statusFilter;

      const matchType =
        typeFilter === 'ALL' ? true : row.facilityType === typeFilter;

      return matchKeyword && matchStatus && matchType;
    });
  }, [list, keyword, statusFilter, typeFilter]);

  const activeCount = useMemo(
    () => filteredList.filter((f) => f.status === 'ACTIVE').length,
    [filteredList],
  );
  const recruitingCount = useMemo(
    () => filteredList.filter((f) => f.status === 'RECRUITING').length,
    [filteredList],
  );

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* 상단 영역 */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
            color: 'primary.main',
            mb: 1,
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          공지사항 관리
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          DB notice 테이블 기준으로 시설 정보를 조회·관리합니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 옵션 바 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'wrap',
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          rowGap: 2,
          columnGap: 2,
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.default
              : theme.palette.grey[50],
        }}
      >
        {/* 왼쪽 필터 영역 */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: 1.5,
            columnGap: 1.5,
            minWidth: 0,
          }}
        >
          <TextField
            select
            label="상태"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              minWidth: 130,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
              },
            }}
          >
            <MenuItem value="ALL">전체</MenuItem>
            <MenuItem value="PINNED">상단 고정</MenuItem>
            <MenuItem value="ACTIVATED">활성화</MenuItem>
            <MenuItem value="DEACTIVATED">비활성화</MenuItem>
          </TextField>

          <TextField
            size="small"
            placeholder="제목 / 공지ID / 내용 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{
              minWidth: { xs: '100%', md: 260 },
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
          <Button variant="contained" onClick={handleRefresh}>
            검색
          </Button>
        </Box>

        {/* 오른쪽: 통계 + 액션 */}
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          spacing={1.5}
          sx={{
            width: { xs: '100%', md: 'auto' },
            justifyContent: {
              xs: 'space-between',
              md: 'flex-end',
            },
          }}
        >
          <Box sx={{ textAlign: 'right', mr: 1 }}>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              총 {filteredList.length}건
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: 'text.primary',
              }}
            >
              활성화 {activeCount}건 / 비활성화 {recruitingCount}건
            </Typography>
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleCreateOrUpdateNotice(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 1.5,
              py: 1,
              whiteSpace: 'nowrap',
            }}
          >
            새 공지 등록
          </Button>

          <Tooltip title="새로고침">
            <IconButton
              size="small"
              onClick={handleRefresh}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  borderColor: 'primary.main',
                },
                width: 32,
                height: 32,
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* 테이블 (연락처 컬럼 없음) */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 0,
          maxHeight: 480,
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: 6, height: 6 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
                '& th': {
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  color: 'text.primary',
                },
              }}
            >
              <TableCell sx={{ minWidth: 60, textAlign: 'center' }}>
                공지ID
              </TableCell>
              <TableCell sx={{ minWidth: 300, textAlign: 'center' }}>
                제목
              </TableCell>
              <TableCell sx={{ minWidth: 100, textAlign: 'center' }}>
                작성(수정)일
              </TableCell>
              <TableCell sx={{ minWidth: 60, textAlign: 'center' }}>
                조회수
              </TableCell>
              <TableCell sx={{ minWidth: 90, textAlign: 'center' }}>
                작성자
              </TableCell>
              <TableCell sx={{ minWidth: 90, textAlign: 'center' }}>
                상태
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>
                액션
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{
                    py: 6,
                    color: 'text.secondary',
                  }}
                >
                  조건에 맞는 공지가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              list.map((row) => (
                <TableRow
                  key={row.noticeId}
                  hover
                  sx={{
                    '&:last-of-type td': {
                      borderBottom: 0,
                    },
                    transition: 'background-color 0.15s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                    }}
                  >
                    {row.noticeId}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  >
                    {row.title}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      color: 'text.secondary',
                    }}
                  >
                    {row.updatedAt
                      ? dateFormat(row.updatedAt)
                      : dateFormat(row.createdAt)}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.viewCount}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    {row.createdByName}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={
                        STATUS_LABEL[customStatus(row.pinned, row.visible)]
                      }
                      size="small"
                      color={
                        STATUS_COLOR[customStatus(row.pinned, row.visible)] ||
                        'default'
                      }
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        px: 1,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="상세 보기">
                      <IconButton
                        size="small"
                        onClick={() => handleView(row.noticeId)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

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
    </Paper>
  );
}

export default FacilityPage;
