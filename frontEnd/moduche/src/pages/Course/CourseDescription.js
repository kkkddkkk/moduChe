import { Box, Typography } from "@mui/material";
import SectionBox from "./SectionBox";

export default function CourseDescription({ hasDetail }) {
  return (
    <SectionBox label="상세 내용" minH={560}>
      {hasDetail && (
        <Box sx={{ p: 3, "& h6": { mt: 3, mb: 1 } }}>
          <Typography variant="h6" gutterBottom>
            강좌 소개
          </Typography>
          <Typography variant="body1" paragraph>
            모두의 필라테스는 모든 신체 조건을 가진 분들을 위해 설계된 맞춤형
            필라테스 강좌입니다. 개인의 유연성, 근력, 균형 감각에 맞춰 안전하고
            점진적으로 코어 근육을 강화하는 데 집중합니다.
          </Typography>

          <Typography variant="h6" gutterBottom>
            무엇을 배우나요?
          </Typography>
          <Typography variant="body1" paragraph>
            - <strong>기초 호흡법:</strong> 필라테스의 가장 기본이 되는
            횡격막 호흡을 통해 몸의 긴장을 풀고 운동 효과를 극대화합니다.
            <br />
            - <strong>매트 운동:</strong> 소도구를 활용하여 척추 안정성과
            전신 근력을 향상시키는 다양한 매트 동작을 배웁니다.
            <br />- <strong>자세 교정:</strong> 일상생활에서 무너진 자세를
            바로잡고, 통증을 완화하는 데 도움이 되는 스트레칭과 운동법을
            익힙니다.
          </Typography>
        </Box>
      )}
    </SectionBox>
  );
}
