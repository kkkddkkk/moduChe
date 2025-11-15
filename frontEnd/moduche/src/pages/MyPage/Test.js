import { Box } from "@mui/material";

const Test = () => {

  return (
    <Box sx={{display: 'flex', gap: 2, width: "100%"}}>
      <Box sx={{minWidth: "35%", height: "50vh", border: "1px solid red"}}>
        dfdf
      </Box>
      <Box sx={{flexGrow: 1,  height: "50vh", border: "1px solid blue"}}>
        dfdf
      </Box>
    </Box>
  );
};
export default Test;
