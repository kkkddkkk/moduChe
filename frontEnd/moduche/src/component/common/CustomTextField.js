import { styled, TextField } from "@mui/material";

const PaddingControlTextField = styled(TextField)(({ padding, size }) => ({
    "& .MuiOutlinedInput-root": {
    padding: 0,               // root 레벨 padding 초기화
    boxSizing: "border-box",
},
    
    // 1. multiline용 클래스 추가
    "& .MuiOutlinedInput-multiline": {
        padding: padding,
        fontSize: size,
    },

    // 2. 내부 textarea 타겟
    "& .MuiOutlinedInput-input.MuiInputBase-inputMultiline": {
        padding: padding,
        fontSize: size,
    },

    // 3. autofill 대응 (textarea용)
    "& textarea:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0px 1000px white inset",
        WebkitTextFillColor: "black",
    },

    "& .MuiOutlinedInput-input": {
        padding: padding, // input 내부 패딩만
        fontSize: size,
    },
    "& input:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0px 1000px white inset",
        WebkitTextFillColor: "black",
    },
    "& .MuiInputBase-root.Mui-disabled": {
        cursor: "not-allowed", // 원하는 커서로 변경 가능
    },
    "& .MuiInputBase-input.Mui-disabled": {
        cursor: "not-allowed",
    },
    "& .MuiFormHelperText-root": {
        marginTop: 0,
        marginLeft: padding,
        fontSize: `${size - 2}px`, // 필요시 font-size 조정
    },
}));


const CustomTextField = ({ data, setData, padding, disabled, placeholder,
    fontSize = 16, helperText, error, rows }) => {
    const size = `${fontSize}px`;
    return (
        <PaddingControlTextField
            multiline={rows ? true : false}
            fullWidth
            variant="outlined"
            value={data}
            onChange={(event) => setData(event.target.value)}
            padding={padding}
            disabled={disabled}
            placeholder={placeholder}
            size={size}
            error={error}
            helperText={error ? helperText : ""}
            rows={rows}
        />
    );
}
export default CustomTextField;
