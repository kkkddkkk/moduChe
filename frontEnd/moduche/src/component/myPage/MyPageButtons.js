import { Box } from '@mui/material';
import { OneAlignedButton } from '../common/Button';
import { Eraser, Save } from 'lucide-react';

const MyPageButtons = ({ eraseFunc, saveFunc }) => {
  return (
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
        startIcon={<Eraser size={18} />}
        color="error"
        onClick={() => {
          if (!window.confirm('정말 초기화하시겠습니까?')) return;
          eraseFunc();
        }}
      >
        초기화
      </OneAlignedButton>
      <OneAlignedButton
        buttonWrapperSx={{ width: '100%' }}
        buttonSx={{ padding: '8px' }}
        startIcon={<Save size={18} />}
        onClick={saveFunc}
      >
        저장하기
      </OneAlignedButton>
    </Box>
  );
};
export default MyPageButtons;
