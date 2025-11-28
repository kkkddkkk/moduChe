import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  fetchCommunityDetail,
  modifyCommunityStatus,
} from '../../api/admin/CommunityAPI';
import { useApi } from '../../hook/useAPI';
import { useNavigate } from 'react-router-dom';

const CommunityDialog = ({ detailOpen, setDetailOpen, communityId }) => {
  const navigate = useNavigate();

  const { callApi: fetchCommunityDetailAPI } = useApi(fetchCommunityDetail);
  const { callApi: modifyCommunityStatusAPI } = useApi(modifyCommunityStatus);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState([]);

  const fetch = async () => {
    const res = await fetchCommunityDetailAPI(communityId);
    setSelected(res.data);
    setStatus(res.data.status);
  };

  const modify = async () => {
    await modifyCommunityStatusAPI(communityId, status);
  };

  const STATUS_LABEL = {
    REGISTERED: '승인대기',
    ACTIVE: '활동',
    INACTIVE: '비활동',
    BANNED: '정지',
    DELETED: '활동 종료',
  };

  useEffect(() => {
    if (!communityId) return;
    fetch();
  }, [communityId]);

  // 상세 다이얼로그 내부 한 줄
  const DetailRow = ({ label, value }) => (
    <Stack
      direction="row"
      spacing={2}
      sx={{ py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Typography
        sx={{
          width: 90,
          minWidth: 90,
          fontSize: '0.85rem',
          color: 'text.secondary',
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          flexGrow: 1,
          fontSize: '0.9rem',
          wordBreak: 'break-all',
        }}
      >
        {value || '-'}
      </Typography>
    </Stack>
  );

  const viewDetailCommunity = (postId) => {
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
      `/community/details/${postId}`,
      'CommunityDetailWindow',
      `scrollbars=yes,width=${w},height=${h},top=${top},left=${left},noopener,noreferrer`,
    );
  };

  function regPhoneNumber(numbers) {
    if(!numbers) return;
    if (numbers.startsWith('01')) {
      // 휴대전화
      numbers = numbers.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('02')) {
      // 2자리 지역번호
      numbers = numbers.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '$1-$2-$3');
    } else {
      // 3자리 지역번호
      numbers = numbers.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3');
    }

    // 마지막 하이픈 제거 (있으면)
    numbers = numbers.replace(/-$/g, '');
    return numbers;
  }

  const save = () => {
    modify();
    setDetailOpen(false);
  };

  return (
    <Dialog
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1.5 }}>
        동아리 상세 정보
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3 }}>
        {selected ? (
          <Box sx={{ pt: 1 }}>
            <DetailRow label="동아리ID" value={selected.communityId || ''} />
            <DetailRow label="동아리명" value={selected.name || ''} />
            <DetailRow label="목적" value={selected.purpose || ''} />
            <DetailRow label="운영 기관" value={selected.founder || ''} />
            <DetailRow label="담당자" value={selected.roleInFac || ''} />
            <DetailRow label="연락처" value={regPhoneNumber(selected.phone) || ''} />
            <DetailRow label="운영 주소" value={selected.address || ''} />
            <DetailRow label="일정" value={selected.scheduleDetail || ''} />
            <DetailRow
              label="상태"
              value={
                <FormControl fullWidth>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    variant={'standard'}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: '4px',
                      },
                    }}
                  >
                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            />
            <Stack
              direction="row"
              spacing={2}
              sx={{
                py: 0.75,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  width: 90,
                  minWidth: 90,
                  fontSize: '0.85rem',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                바로가기
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                }}
              >
                <Button
                  sx={{ padding: 0 }}
                  onClick={() => viewDetailCommunity(selected.postId)}
                >
                  {selected.title || ''}
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            선택된 동아리가 없습니다.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button
          onClick={() => setDetailOpen(false)}
          variant="contained"
          size="small"
          color="error"
        >
          닫기
        </Button>
        <Button onClick={save} variant="contained" size="small">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CommunityDialog;
