import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Button,
  Snackbar,
  Alert,
  Fade,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
} from '@mui/material';

import {
  StartTitle,
  SmallerSubTitle,
  Contents100,
} from '../../component/common/Text';
import RichTextEditor from '../../component/common/RichTextEditor';
import { BellPlus, Info } from 'lucide-react';
import { ImageUpload } from '../../component/common/ImageUpload';
import { getUsernameFromToken } from '../../utils/auth';
import { useApi } from '../../hook/useAPI';
import { createNotice, fetchNoticeDetail } from '../../api/admin/NoticeAPI';
import { useParams } from 'react-router-dom';

export default function NoticeCreateWindow() {
  const params = useParams();
  const noticeId = params.noticeId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageForm, setImageForm] = useState({ images: [] });
  const [status, setStatus] = useState('ACTIVATED');
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const theme = useTheme();
  const accessToken = localStorage.getItem('accessToken');

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 필수값 체크
  const disabled = useMemo(
    () => !title.trim() || !content.trim(),
    [title, content],
  );

  const { callApi: fetchNoticeDetailAPI } = useApi(fetchNoticeDetail);
  useEffect(() => {
    if (noticeId === null) return;
    const fetch = async () => {
      const res = fetchNoticeDetailAPI(noticeId);
      console.log(res.data);
    };
    fetch();
  }, []);

  useEffect(() => {
    setIsPinned(status === 'PINNED');
    setIsVisible(status === 'ACTIVATED' || status === 'PINNED');
  }, [status]);

  const { callApi: createNoticeAPI } = useApi(createNotice);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    const dto = {
      username: getUsernameFromToken(accessToken),
      title: title,
      content: content,
      isPinned: isPinned,
      isVisible: isVisible,
      imgUrls: imageForm.images.map((img) => img.url),
    };

    // multipart/form-data 구성.
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(dto)], { type: 'application/json' }),
    );

    imageForm.images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });

    const res = await createNoticeAPI(formData);

    try {
      window.opener?.postMessage(
        { type: 'NOTIFY_CREATED', dto },
        window.origin,
      );
      setToast({
        open: true,
        message: '공지가 등록되었습니다.',
        severity: 'success',
      });
      setTimeout(() => window.close(), 700);
    } catch (err) {
      console.error('postMessage 실패:', err);
      setToast({
        open: true,
        message: '데이터 전송 실패',
        severity: 'error',
      });
    }
  };

  // ESC 닫기 + 팝업 크기 고정
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && window.close();
    window.addEventListener('keydown', onKey);
    document.title = '새 공지 등록';
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? t.palette.background.default : '#fafafa',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{ width: 800, maxWidth: '100%', borderRadius: 3, p: 3 }}
      >
        <Stack spacing={2}>
          <StartTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BellPlus fontSize="large" /> 새 공지 등록
          </StartTitle>

          <SmallerSubTitle>페이지 공지사항을 등록합니다.</SmallerSubTitle>

          {/* 시설명 */}
          <Contents100 bold>제목</Contents100>
          <TextField
            size="small"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="11/17 공지사항입니다."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <Info fontSize={'small'} />
                </InputAdornment>
              ),
            }}
          />

          <Contents100 bold>내용</Contents100>
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              overflow: 'hidden',
            }}
          >
            <RichTextEditor
              value={content}
              onChange={(value) => setContent(value)}
            />
          </Box>

          <Contents100 bold>이미지 첨부</Contents100>
          <ImageUpload form={imageForm} setForm={setImageForm} />

          {/* 시설 유형 */}
          <Contents100 bold>공지 상태</Contents100>
          <TextField
            select
            size="small"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ACTIVATED">일반</MenuItem>
            <MenuItem value="PINNED">상단고정</MenuItem>
            <MenuItem value="DEACTIVATED">비활성화</MenuItem>
          </TextField>

          {/* 버튼 */}
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="flex-end"
            sx={{ pt: 1 }}
          >
            <Button variant="text" onClick={() => window.close()}>
              취소
            </Button>
            <Button
              variant="contained"
              disabled={disabled}
              onClick={handleSubmit}
            >
              등록
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 토스트 */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Fade in>
          <Alert severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        </Fade>
      </Snackbar>
    </Box>
  );
}
