import { styled, TextField } from '@mui/material';
import React from 'react';

const PaddingControlTextField = styled(TextField)(({ padding, size }) => ({
  '& .MuiOutlinedInput-root': {
    padding: 0, // root 레벨 padding 초기화
    boxSizing: 'border-box',
  },

  // 1. multiline용 클래스 추가
  '& .MuiOutlinedInput-multiline': {
    padding: padding,
    fontSize: size,
  },

  // 2. 내부 textarea 타겟
  '& .MuiOutlinedInput-input.MuiInputBase-inputMultiline': {
    padding: padding,
    fontSize: size,
  },

  // 3. autofill 대응 (textarea용)
  '& textarea:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0px 1000px white inset',
    WebkitTextFillColor: 'black',
  },

  '& .MuiOutlinedInput-input': {
    padding: padding, // input 내부 패딩만
    fontSize: size,
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0px 1000px white inset',
    WebkitTextFillColor: 'black',
  },
  '& .MuiInputBase-root.Mui-disabled': {
    cursor: 'not-allowed', // 원하는 커서로 변경 가능
  },
  '& .MuiInputBase-input.Mui-disabled': {
    cursor: 'not-allowed',
  },
  '& .MuiFormHelperText-root': {
    marginTop: 0,
    marginLeft: padding,
    fontSize: `${size - 2}px`, // 필요시 font-size 조정
  },
}));

const CustomTextField = React.memo(
  ({
    data,
    setData,
    padding,
    disabled,
    placeholder,
    fontSize = 16,
    helperText,
    error,
    rows,
    name,
    margin,
    show = true,
    rest,
    variant="outlined"
  }) => {
    return (
      <PaddingControlTextField
        {...rest}
        name={name}
        multiline={rows ? true : false}
        fullWidth
        variant={variant}
        value={data}
        onChange={(event) => setData(event.target.value)}
        padding={padding}
        disabled={disabled}
        placeholder={placeholder}
        size={fontSize + 'px'}
        error={error}
        helperText={error ? helperText : ''}
        rows={rows}
        margin={margin}
        type={show ? 'text' : 'password'}
        ref={rest?.inputRef}
      />
    );
  },
);
export default CustomTextField;
