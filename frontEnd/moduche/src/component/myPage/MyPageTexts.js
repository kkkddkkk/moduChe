import { Box } from "@mui/material";
import { SubTitle } from "../common/Text";

 export const MyPageText = ({ icon, children }) => {
    return (
      <Box display={'flex'} alignItems={'center'} gap={1}>
        {icon}
        <SubTitle>{children}</SubTitle>
      </Box>
    );
  };
