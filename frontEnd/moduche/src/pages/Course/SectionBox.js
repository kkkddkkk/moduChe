import { Box, Typography } from "@mui/material";
import Paper from "../../component/common/Paper";

export default function SectionBox({ children, label, minH = 420, aspect }) {
  return (
    <Paper
      sx={{
        m: 0, // 
        p: 0,
        overflow: "hidden",
        minHeight: minH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...(aspect ? { aspectRatio: aspect } : {}),
      }}
    >
      <Box sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
        {children ? (
          children
        ) : (
          <Box
            sx={{
              height: "100%",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {label}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
