import { Box, Divider } from "@mui/material";
import { Contents } from "../common/Text";


export const MainTextContainer = ({children, margin=0}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center", // 세로 가운데 정렬
                gap: 1, // 항목 간 간격
                margin: margin
            }}
        >
            {children}
        </Box>
    )
}

export const MainMenu = ({ children, onClick, menuColor }) => {
    return (
        <Contents color={menuColor} hover={true} onClick={onClick}>
            {children}
        </Contents>
    )
}

export const MainBar = ({ barColor }) => {
    return <Divider orientation="vertical" flexItem sx={{ borderColor: barColor }} />
}
