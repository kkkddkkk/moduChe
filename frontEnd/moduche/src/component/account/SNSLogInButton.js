import { Box, IconButton, useTheme } from '@mui/material';
import { Contents100 } from '../common/Text';

const SNSLogInButton = ({ onClick, logoFileName, snsName, outline }) => {
    const theme = useTheme();
    const main = theme.palette.primary.main;
  return (
    <IconButton
      size="large"
      edge="end"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={onClick}
    >
      <Box flexDirection={"column"}>
        <Box
          component={'img'}
          src={`/logo/${logoFileName}.png`}
          sx={{
            borderRadius: '100%',
            width: 40,
            height: 'auto',
            display: 'inline-block',
            cursor: 'pointer',
            border: outline?`1px solid ${main}`:"none"
          }}
        />
        <Contents100>{snsName} ID로</Contents100>
        <Contents100>로그인하기</Contents100>
      </Box>
    </IconButton>
  );
};
export default SNSLogInButton;
