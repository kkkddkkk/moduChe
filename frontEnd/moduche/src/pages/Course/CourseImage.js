// CourseImage.jsx
import { Box } from "@mui/material";

export default function CourseImage({ hasImage, src, alt = "course" }) {
  if (!hasImage) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%", // 부모 Box의 너비를 100% 채움
        height: "100%", // 부모 Box의 높이를 100% 채움
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 3, // ✅ CommunityImage랑 통일
          display: "block",
        }}
      />
    </Box>
  );
}
