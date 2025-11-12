import { Grid, TextField } from '@mui/material';
import { MyPageText } from './MyPageTexts';
import { Phone } from 'lucide-react';
import { useEffect } from 'react';

export const SetPhoneNumber = ({
  numberError,
  number,
  setNumber,
  setNumberError,
}) => {
  const regPhone = /^(01[016789]\d{3,4}\d{4}|0\d{1,2}\d{3,4}\d{4})$/;
  function regPhoneNumber(numbers) {
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

  useEffect(() => {
    //번호 검증
    if (number.length > 0 && !regPhone.test(number)) {
      setNumberError(true);
    } else {
      setNumberError(false);
    }
  }, [number]);

  return (
    <Grid size={12} marginBottom={'5%'}>
      <MyPageText icon={<Phone />}>연락처</MyPageText>
      <TextField
        value={regPhoneNumber(number)}
        placeholder="전화번호"
        error={numberError}
        helperText={numberError ? '올바르지 않은 형식입니다.' : ''}
        fullWidth
        inputProps={{
          style: { padding: 10 },
        }}
        type="text"
        onChange={(e) => {
          setNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11));
        }}
      />
    </Grid>
  );
};
