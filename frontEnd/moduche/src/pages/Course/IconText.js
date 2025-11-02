import { Box, Typography, SvgIcon } from "@mui/material";

export default function IconText({
  icon: Icon,
  children,
  size = 20,
  fontSize = "1rem",
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        lineHeight: 1.2,
        verticalAlign: "middle",
        "& .MuiSvgIcon-root": { display: "block" },
      }}
    >
      <SvgIcon component={Icon} inheritViewBox sx={{ fontSize: size }} />
      <Typography
        component="span"
        color="text.secondary"
        sx={{ fontSize: fontSize, lineHeight: 1.2 }}
      >
        {children}
      </Typography>
    </Box>
  );
}
