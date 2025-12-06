// src/pages/MyPage/MyEnrolledCoursePage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import Loading from "../../component/common/Loading";
import { SubTitle } from "../../component/common/Text";
import { fetchMyEnrolledCourses } from "../../api/courseAPI"; // 너가 쓰는 이름 유지

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "ongoing", label: "수강 중" },
  { key: "finished", label: "수강 완료" },
];

export default function MyEnrolledCoursePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchMyEnrolledCourses();
        if (!alive) return;
        setCourses(list || []);
      } catch (e) {
        if (!alive) return;
        console.error("내 수강 강좌 조회 실패", e);
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = courses.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const ongoingCount = courses.filter((c) => c.status === "ongoing").length;
  const finishedCount = courses.filter((c) => c.status === "finished").length;

  const statusLabel = (status) =>
    status === "ongoing" ? "수강 중" : "수강 완료";

  if (loading) {
    return <Loading open={true} text="수강 중인 강좌를 불러오는 중입니다." />;
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200, // 필요하면 더 키워도 됨
          mx: "auto", // 콘텐츠를 전체 영역 기준 가운데 정렬
        }}
      >
        {/* ===== 상단 타이틀 & 요약 카드 ===== */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <SubTitle>내 수강 강좌</SubTitle>

          <Typography variant="body2" color="text.secondary">
            현재 수강 중이거나 수강 완료한 강좌 내역을 한눈에 확인할 수
            있습니다.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap", // wrap을 유지하되, 위의 isMobile 기준을 느리게 바꿈으로써 더 오래 가로 유지
              background:
                "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.02))",
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 260 }}>
              <Typography variant="subtitle2" color="text.secondary">
                수강 현황 요약
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                총 {courses.length}개 강좌를 수강했습니다.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip
                  size="small"
                  label={`수강 중 ${ongoingCount}개`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`수강 완료 ${finishedCount}개`}
                  color="default"
                  variant="outlined"
                />
              </Stack>
            </Stack>

            {/* 필터 탭 */}
            <Tabs
              value={filter}
              onChange={(_, v) => setFilter(v)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minHeight: 36,
                minWidth: 240,
                "& .MuiTab-root": {
                  minHeight: 36,
                  px: 2.5,
                  fontSize: 14,
                },
              }}
            >
              {FILTERS.map((f) => (
                <Tab key={f.key} label={f.label} value={f.key} />
              ))}
            </Tabs>
          </Paper>
        </Stack>

        {/* 에러 메시지 */}
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 2, whiteSpace: "pre-wrap" }}
          >
            {String(error.message || error)}
          </Typography>
        )}

        {/* 데이터 없음 */}
        {filtered.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body1" gutterBottom>
              아직 해당 상태의 수강 강좌가 없습니다.
            </Typography>
            <Typography variant="body2">
              관심 있는 강좌를 찾아 수강을 시작해 보세요!
            </Typography>
          </Paper>
        ) : isDesktop ? (
          // ===== 데스크탑: 테이블 뷰 =====
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <TableCell sx={{ width: "40%" }}>강좌명</TableCell>
                    <TableCell>시설 / 기관</TableCell>
                    <TableCell>수강 기간</TableCell>
                    <TableCell>요일 · 시간</TableCell>
                    <TableCell align="center">상태</TableCell>
                    <TableCell align="center">관리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((course) => (
                    <TableRow
                      key={course.enrollmentId ?? course.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:last-of-type td": { borderBottom: 0 },
                      }}
                      onClick={() => navigate(`/course/${course.courseId}`)}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 360,
                          }}
                        >
                          {course.title}
                        </Typography>
                        {course.period && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "inline-block",
                              mt: 0.25,
                            }}
                          >
                            수강 기간: {course.period}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {course.facilityName || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {course.period || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {course.dayTime || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={statusLabel(course.status)}
                          color={
                            course.status === "ongoing" ? "primary" : "default"
                          }
                          variant={
                            course.status === "ongoing" ? "filled" : "outlined"
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Eye size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${course.courseId}`);
                          }}
                        >
                          강좌 보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          // ===== 모바일: 카드 뷰 =====
          <Grid container spacing={2}>
            {filtered.map((course) => (
              <Grid item xs={12} key={course.enrollmentId ?? course.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/course/${course.courseId}`)}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{
                            wordBreak: "keep-all",
                            mb: 0.25,
                          }}
                        >
                          {course.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {course.facilityName}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={statusLabel(course.status)}
                        color={
                          course.status === "ongoing" ? "primary" : "default"
                        }
                      />
                    </Stack>

                    {course.period && (
                      <Typography variant="body2">{course.period}</Typography>
                    )}
                    {course.dayTime && (
                      <Typography variant="body2" color="text.secondary">
                        {course.dayTime}
                      </Typography>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="text"
                        endIcon={<Eye size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.courseId}`);
                        }}
                      >
                        강좌 상세 보기
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
