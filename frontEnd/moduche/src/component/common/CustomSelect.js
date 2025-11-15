import {
  FormControl,
  FormHelperText,
  lighten,
  MenuItem,
  Select,
  styled,
} from '@mui/material';
const SelectController = styled(Select)(({ ownerState }) => ({
  '& .MuiSelect-select': {
    padding: ownerState.padding, // 선택 영역 padding
    fontSize: ownerState.size,
    display: 'flex',
    alignItems: 'center', // vertical 중앙 정렬
  },
  '& .MuiFormHelperText-root': {
    margin: `0 !important`,
    fontSize: `${ownerState.size}px`,
  },
}));

export const CustomSelect = ({
  padding,
  size,
  data,
  format = (d) => d,
  selected,
  setSelected,
  placeholder,
  variant,
  disabled,
  error,
  helperText,
  renderValue,
}) => {
  const black = 'black';
  const gray = 'gray';
  const mainColor = '#1976d2';
  const white = 'white';
  return (
    <FormControl fullWidth variant={variant}>
      <SelectController
        ownerState={{ padding: padding, size: size }}
        value={
          // selected가 객체면 selected.value, 아니면 selected 자체를 value로 사용
          selected && typeof selected === 'object'
            ? selected.value
            : selected ?? ''
        }
        onChange={(e) => {
          const val = e.target.value;
          // data에서 객체이면 value로 비교, primitive이면 그대로 비교
          const obj = data.find((d) =>
            typeof d === 'object' ? d.value === val : d === val,
          );
          setSelected(obj ?? val); // 객체면 객체, 아니면 primitive
        }}
        displayEmpty
        renderValue={
          renderValue
            ? renderValue
            : (value) => (
                <span style={{ color: value ? black : gray }}>
                  {value || placeholder}
                </span>
              )
        }
        disabled={disabled}
        error={error}
      >
        {data.map((d, idx) => {
          const value = typeof d === 'object' ? d.value : d;
          const label = typeof d === 'object' ? format(d) : format(d);
          return (
            <MenuItem
              key={`option_${idx}`}
              value={value}
              sx={{
                color: value === selected ? 'blue' : black, // 선택된 항목이면 파랑, 아니면 검정
                '&.Mui-selected': {
                  backgroundColor: lighten(mainColor, 0.1), // 선택 시 배경색
                  color: white, // 선택 시 텍스트 색상
                },
                '&:hover': {
                  backgroundColor: lighten(mainColor, 0.5), // 마우스 오버 배경색
                  color: black, // 선택 시 텍스트 색상
                },
                '&.Mui-selected:hover': {
                  backgroundColor: lighten(mainColor, 0.5), // 마우스 오버 배경색
                  color: black, // 선택 시 텍스트 색상
                },
              }}
            >
              {label}
            </MenuItem>
          );
        })}
      </SelectController>
      {error && (
        <FormHelperText
          sx={{
            color: 'red',
            marginLeft: `${padding / 4}px`,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const StandardSelect = ({
  padding,
  size,
  data,
  format,
  selected,
  setSelected,
  placeholder,
  error,
  helperText,
  disabled,
  renderValue,
}) => {
  return (
    <CustomSelect
      padding={padding}
      size={size}
      data={data}
      format={format}
      selected={selected}
      setSelected={setSelected}
      placeholder={placeholder}
      variant={'standard'}
      error={error}
      helperText={helperText}
      disabled={disabled}
      renderValue={renderValue}
    />
  );
};

export const OutlinedSelect = ({
  padding,
  size,
  data,
  format,
  selected,
  setSelected,
  placeholder,
  error,
  helperText,
  disabled,
}) => {
  return (
    <CustomSelect
      padding={padding}
      size={size}
      data={data}
      format={format}
      selected={selected}
      setSelected={setSelected}
      placeholder={placeholder}
      variant={'outlined'}
      error={error}
      helperText={helperText}
      disabled={disabled}
    />
  );
};
