import { styled, TextField } from "@mui/material";

const PaddingControlTextField = styled(TextField)(({ padding }) => ({
    "& .MuiInputBase-input": {
        padding: padding,
    },
    "& .MuiOutlinedInput-root": {
        padding: padding,
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
}));


const CustomTextField = ({ data, setData, padding, disabled, placeholder }) => {
    return (
        <PaddingControlTextField
            fullWidth
            variant="outlined"
            value={data}
            onChange={(event) => setData(event.target.value)}
            padding={padding}
            disabled={disabled}
            placeholder={placeholder}
        />
    );
}
export default CustomTextField;
