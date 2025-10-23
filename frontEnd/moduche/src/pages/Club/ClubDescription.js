import { Box, Typography } from "@mui/material";
import SectionBox from "../Course/SectionBox";

export default function ClubDescription({ hasDetail, clubData }) {
  return (
    <SectionBox label="동호회 상세 내용" sx={{ flexGrow: 1 }}>
      {hasDetail && (
        <Box sx={{ p: 3, "& h6": { mt: 3, mb: 1.5 }, "& p": { mb: 1.5 } }}>
          <Typography variant="h6" gutterBottom>
            동호회 소개
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>{clubData.name}</strong>에 오신 것을 환영합니다! 저희는 달리기를 사랑하는 사람들이 모여 함께 건강한 습관을 만들어가는 커뮤니티입니다.
            초보자부터 숙련자까지 모두 환영하며, 아름다운 {clubData.location}을 함께 달리며 즐거운 주말 아침을 시작합니다.
          </Typography>

          <Typography variant="h6" gutterBottom>
            주요 활동 내용
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
            <li>매주 토요일 아침 정기 런닝</li>
            <li>분기별 마라톤 대회 참가</li>
            <li>달리기 자세 교정 및 팁 공유</li>
            <li>친목 도모를 위한 번개 모임</li>
          </Box>

          <Typography variant="h6" gutterBottom>
            이런 분들께 추천해요
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
            <li>혼자 하는 달리기가 지겨우신 분</li>
            <li>달리기를 이제 막 시작하려는 초보 러너</li>
            <li>함께 운동하며 동기부여를 얻고 싶으신 분</li>
            <li>새로운 사람들과 건강한 교류를 원하시는 분</li>
          </Box>

          <Typography variant="h6" gutterBottom>
            준비물
          </Typography>
          <Typography variant="body1" paragraph>
            편한 운동화와 복장, 그리고 달리기를 즐길 마음만 있다면 충분합니다!
          </Typography>

          <Typography variant="h6" gutterBottom>
            가입 안내
          </Typography>
          <Typography variant="body1" paragraph>
            우측의 '동호회 가입' 버튼을 통해 언제든지 가입 신청을 할 수 있습니다. 가입 승인 후 단체 채팅방에 초대해 드립니다.
            궁금한 점이 있다면 언제든지 문의해주세요!
          </Typography>
        </Box>
      )}
    </SectionBox>
  );
}