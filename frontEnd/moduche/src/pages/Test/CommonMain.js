import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const CommonMain = () => {
    return (
        <Box>
            <Outlet/>
        </Box>
    );
}

export default CommonMain;