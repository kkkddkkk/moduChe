// components/FixedImageFrame.jsx
import { Box, useTheme } from "@mui/material";

export default function FixedImageFrame({
  src,
  alt = "",
  mode = "fill",          // "fill" | "fixed" | "ratio"
  heights = { xs: 220, sm: 260, md: 300, lg: 320 }, // mode='fixed'
  ratio = "4 / 3",         // mode='ratio'
  radius = 8,
  shadow = 1,
  sx,
}) {
  const theme = useTheme();

  // 반응형 높이 (MUI가 확실히 인식하게 media query 형태)
  const responsiveFixed = {
    height: heights.xs,
    [theme.breakpoints.up("sm")]: { height: heights.sm },
    [theme.breakpoints.up("md")]: { height: heights.md },
    [theme.breakpoints.up("lg")]: { height: heights.lg },
  };

  const frameSx =
    mode === "fill"
      ? { height: "100%", minHeight: heights.xs } // 같은 행의 높이에 맞춰 자동으로 늘어남
      : mode === "fixed"
      ? responsiveFixed
      : { aspectRatio: ratio, minHeight: heights.xs };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: (t) => t.shadows[shadow],
        bgcolor: "grey.100",
        ...frameSx,
        ...sx,
      }}
    >
      {src && (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </Box>
  );
}
