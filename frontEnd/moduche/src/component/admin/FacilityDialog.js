import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

const FacilityDialog = () => {
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
            <DetailRow label="동아리ID" value={selected.facilityId} />
            <DetailRow label="동아리명" value={selected.facilityName} />
            <DetailRow
              label="시설 타입"
              value={
                FACILITY_TYPE_LABEL[selected.facilityType] ||
                selected.facilityType
              }
            />
            <DetailRow label="주소" value={selected.facilityAddress} />
            <DetailRow label="연락처" value={selected.facilityPhone} />
            <DetailRow label="운영 시간" value={selected.openHours} />
            <DetailRow label="접근성" value={selected.accessibilityFeatures} />
            <DetailRow
              label="위도"
              value={selected.geoLat != null ? String(selected.geoLat) : '-'}
            />
            <DetailRow
              label="경도"
              value={selected.geoLng != null ? String(selected.geoLng) : '-'}
            />
            <DetailRow
              label="상태"
              value={STATUS_LABEL[selected.status] || selected.status}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            선택된 시설이 없습니다.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button
          onClick={() => setDetailOpen(false)}
          variant="contained"
          size="small"
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default FacilityDialog;
