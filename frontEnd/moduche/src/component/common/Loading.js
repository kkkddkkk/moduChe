import { Backdrop, CircularProgress, Box, Typography, useTheme } from '@mui/material';

export default function Loading({ open, text = '로딩중...' }) {

  const theme = useTheme();
    const mainColor = theme.palette.primary.main;
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