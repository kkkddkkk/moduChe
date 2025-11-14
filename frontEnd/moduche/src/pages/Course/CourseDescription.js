// CourseDescription.jsx
import { Box, Typography } from "@mui/material";
import SectionBox from "./SectionBox";
import MetaRow from "./MetaRow";

export default function CourseDescription({
  hasDetail,
  title,
  description,
  tags = [],
  address,
}) {
  return (
    <SectionBox label="상세 내용" sx={{ flexGrow: 1 }}>
      {hasDetail && (
        <Box sx={{ p: 3, "& h6": { mt: 3, mb: 1.5 }, "& p": { mb: 1.5 } }}>
          <MetaRow tags={tags} address={address} />

          <Typography variant="h6" gutterBottom>
            강좌 소개
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.4rem", lineHeight: 1.45 }}
          >
            {description ?? "설명이 아직 등록되지 않았습니다."}
          </Typography>
          {/* 필요 시 섹션 추가 */}
        </Box>
      )}
    </SectionBox>
  );
}
