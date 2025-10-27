import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";

const CommunityManagePage = () => {
  const [tab, setTab] = useState(0);

  // 더미 데이터
  const joinRequests = [
    { id: 1, name: "홍길동", reason: "함께 운동하고 싶어요" },
    { id: 2, name: "김영희", reason: "친구 추천으로 왔어요" },
  ];

  const members = [
    { id: 1, name: "고주임", role: "회장" },
    { id: 2, name: "홍길동", role: "회원" },
  ];

  const posts = [
    { id: 1, title: "10월 아침 체조 모집", date: "2025-10-15" },
    { id: 2, title: "가을 트래킹 일정 공지", date: "2025-09-30" },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        내 동아리 관리
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab label="가입 요청" />
        <Tab label="회원 관리" />
        <Tab label="모집 게시글 관리" />
      </Tabs>

      {/* 가입 요청 관리 */}
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            가입 요청 목록
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>지원 동기</TableCell>
                <TableCell align="right">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {joinRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="success">
                      승인
                    </Button>
                    <Button size="small" color="error">
                      거절
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* 회원 관리 */}
      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            현재 회원 목록
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>역할</TableCell>
                <TableCell align="right">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error">
                      탈퇴
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* 모집 게시글 관리 */}
      {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            모집 게시글 관리
          </Typography>

          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="새 모집글 제목을 입력하세요"
            />
            <Button variant="contained">등록</Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="right">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="info">
                      수정
                    </Button>
                    <Button size="small" color="error">
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default CommunityManagePage;
