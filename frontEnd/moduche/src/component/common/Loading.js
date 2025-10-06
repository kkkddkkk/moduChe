import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

export default function Loading({ open, text = '로딩중...' }) {

    const mainColor = "#1976d2";
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={open}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress sx={{color: mainColor}}/>
        <Typography>{text}</Typography>
      </Box>
    </Backdrop>
  );
}