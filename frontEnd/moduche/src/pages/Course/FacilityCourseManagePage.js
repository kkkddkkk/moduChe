// src/pages/MyPage/FacilityCourseManagePage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import { Search, RefreshCcw } from "lucide-react";
import { SubTitle } from "../../component/common/Text";
import {
  getFacilityEnrollmentSummaries,
  approveEnrollment,
  rejectEnrollment,
} from "../../api/courseAPI";

const STATUS_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "REQUESTED", label: "승인대기" },
  { value: "APPROVED", label: "승인됨" },
  { value: "REJECTED", label: "거절됨" },
];

export default function FacilityCourseManagePage() {
  const [status, setStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1); // 1-based (UI)
  const [size] = useState(10);

  const [rawItems, setRawItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ 1) 백엔드에서 Page<EnrollmentForFacilityResponse> 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getFacilityEnrollmentSummaries(page - 1, size);
        console.log("📌 시설 수강신청 응답:", data);

        const content = Array.isArray(data) ? data : data.content || [];

        const mapped = content.map((e) => ({
          enrollmentId: e.enrollmentId,
          courseId: e.courseId,
          courseTitle: e.courseTitle,
          userName: e.name, // DTO 필드 이름에 맞게 조정
          userPhone: e.phone,
          sessionId: e.sessionId,
          date: e.date, // LocalDate → ISO string
          status: e.status, // REQUESTED / APPROVED / REJECTED
        }));

        setRawItems(mapped);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("❌ 시설 수강신청 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, size]);

  // ✅ 2) 상태 + 검색어 필터 (클라)
  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return rawItems.filter((c) => {
      const matchStatus = status === "ALL" ? true : c.status === status;

      const matchKeyword =
        !q ||
        c.courseTitle.toLowerCase().includes(q) ||
        String(c.courseId).includes(q) ||
        c.userName.toLowerCase().includes(q) ||
        c.userPhone.includes(q);

      return matchStatus && matchKeyword;
    });
  }, [rawItems, status, keyword]);

  // ✅ 3) (선택) 필터 후 클라 페이징 다시 하고 싶으면 여기서 slice
  // 지금은 백엔드 페이징 + 클라 필터만 사용
  const items = filteredItems;

  // ✅ 4) 상단 요약
  const summary = useMemo(() => {
    const base = { pending: 0, approved: 0, rejected: 0 };
    rawItems.forEach((c) => {
      if (c.status === "REQUESTED") base.pending += 1;
      else if (c.status === "APPROVED") base.approved += 1;
      else if (c.status === "REJECTED") base.rejected += 1;
    });
    return base;
  }, [rawItems]);

  const handleSearchClick = () => {
    // 상태/검색어 바뀐 뒤 첫 페이지로
    setPage(1);
  };

  const handleRefresh = () => {
    setKeyword("");
    setStatus("ALL");
    setPage(1);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  // ✅ 5) 승인 / 거절
  const handleApprove = async (enrollmentId) => {
    if (!window.confirm("해당 수강신청을 승인하시겠습니까?")) return;
    try {
      await approveEnrollment(enrollmentId);
      setRawItems((prev) =>
        prev.map((e) =>
          e.enrollmentId === enrollmentId ? { ...e, status: "APPROVED" } : e
        )
      );
    } catch (err) {
      console.error("❌ 수강신청 승인 실패:", err);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (enrollmentId) => {
    if (!window.confirm("해당 수강신청을 거절하시겠습니까?")) return;
    try {
      await rejectEnrollment(enrollmentId);
      setRawItems((prev) =>
        prev.map((e) =>
          e.enrollmentId === enrollmentId ? { ...e, status: "REJECTED" } : e
        )
      );
    } catch (err) {
      console.error("❌ 수강신청 거절 실패:", err);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  const renderStatusChip = (s) => {
    if (s === "REQUESTED")
      return <Chip label="승인대기" color="warning" size="small" />;
    if (s === "APPROVED")
      return <Chip label="승인됨" color="success" size="small" />;
    if (s === "REJECTED")
      return <Chip label="거절됨" color="default" size="small" />;
    return <Chip label={s} size="small" />;
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#F3F4F6",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {/* 상단 타이틀 */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <SubTitle>강좌 수강신청 승인 관리</SubTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            내 시설 강좌에 들어온 수강신청을 조회하고 승인/거절할 수 있습니다.
          </Typography>
        </Box>

        {/* 검색/필터 영역 */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* 상태 셀렉트 */}
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary">
              상태
            </Typography>
            <Select
              fullWidth
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* 검색 인풋 */}
          <Box sx={{ flexGrow: 1, minWidth: 260 }}>
            <Typography variant="caption" color="text.secondary">
              검색어
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="강좌명 / ID / 신청자명 / 연락처 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 검색 버튼 + 요약 + 새로고침 */}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            <Button
              variant="contained"
              size="medium"
              sx={{ minWidth: 90 }}
              onClick={handleSearchClick}
            >
              검색
            </Button>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                승인대기 {summary.pending}건 / 승인 {summary.approved}건 / 거절{" "}
                {summary.rejected}건
              </Typography>
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshCcw size={16} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>

        {/* 테이블 영역 */}
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                <TableCell align="center">신청 ID</TableCell>
                <TableCell>강좌명</TableCell>
                <TableCell>신청자</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>수강일</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {loading
                        ? "데이터를 불러오는 중입니다..."
                        : "조건에 맞는 수강신청이 없습니다."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((enroll) => (
                  <TableRow key={enroll.enrollmentId} hover>
                    <TableCell align="center">{enroll.enrollmentId}</TableCell>
                    <TableCell>{enroll.courseTitle}</TableCell>
                    <TableCell>{enroll.userName}</TableCell>
                    <TableCell>{enroll.userPhone}</TableCell>
                    <TableCell>{enroll.date}</TableCell>

                    {/* 상태 칩 */}
                    <TableCell align="center">
                      {renderStatusChip(enroll.status)}
                    </TableCell>

                    {/* 액션 버튼 */}
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        {enroll.status === "REQUESTED" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleApprove(enroll.enrollmentId)}
                            >
                              승인
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleReject(enroll.enrollmentId)}
                            >
                              거절
                            </Button>
                          </>
                        )}

                        {enroll.status === "APPROVED" && (
                          <Typography variant="body2" color="text.secondary">
                            승인 완료
                          </Typography>
                        )}

                        {enroll.status === "REJECTED" && (
                          <Typography variant="body2" color="text.secondary">
                            거절됨
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* 페이지네이션 */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            size="small"
          />
        </Box>
      </Paper>
    </Box>
  );
}
