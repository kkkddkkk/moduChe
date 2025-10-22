import { Box } from "@mui/material";
import SectionBox from "./SectionBox"; // SectionBox를 별도 파일로 분리했다고 가정

export default function CourseImage({ hasImage }) {
  return (
    <SectionBox label="이미지" minH={420} aspect="3 / 2">
      {hasImage && (
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
          alt="cover"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </SectionBox>
  );
}
