import { Box } from "@mui/material";

export default function CourseImage({
  hasImage,
  src,
  alt = "course",
}) {
  if (!hasImage) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%", // 부모 Grid item의 높이를 100% 채움
        borderRadius: 2, // SectionBox와 통일성을 위해 2로 설정
        overflow: "hidden",
        position: "relative",
        bgcolor: "grey.100",
        boxShadow: 1,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // 이미지가 영역을 가득 채우도록 설정 (비율 유지, 일부 잘릴 수 있음)
          display: "block",
        }}
      />
    </Box>
  );
}
