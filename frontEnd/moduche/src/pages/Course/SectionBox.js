import { Box, Typography } from "@mui/material";
import Paper from "../../component/common/Paper";

export default function SectionBox({ children, label, sx }) {
  return (
    <Paper
      sx={{
        m: 0,
        p: 0,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children ? (
        children
      ) : (
        <Box
          sx={{
            height: 200,
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
    </Paper>
  );
}
