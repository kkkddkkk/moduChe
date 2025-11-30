// src/component/facility/FacilityEnrollmentManage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/HighlightOff";

import Paper from "../common/Paper";
import { dateFormat } from "../common/Functions";
import {
  getFacilityEnrollments,
  approveEnrollment,
  rejectEnrollment,
} from "../../api/courseAPI";

const STATUS_LABEL = {
  REQUESTED: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "거절됨",
};

const STATUS_COLOR = {
  REQUESTED: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export default function FacilityEnrollmentManage() {
  const [page, setPage] = useState(1); // UI는 1-based
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageIndex) => {
    try {
      setLoading(true);
      const res = await getFacilityEnrollments(pageIndex, pageSize);
      // res = { content, totalPages, totalElements, ... }
      setList(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (e) {
      console.error("시설 수강신청 목록 로드 실패", e);
      // 필요하면 여기서 토스트/알럿 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 백엔드는 0-based, UI는 1-based
    fetchData(page - 1);
  }, [page]);

  const handleApprove = async (enrollmentId) => {
    try {
      await approveEnrollment(enrollmentId);
      // 간단하게 다시 로드
      fetchData(page - 1);
    } catch (e) {
      console.error("수강신청 승인 실패", e);
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      await rejectEnrollment(enrollmentId);
      fetchData(page - 1);
    } catch (e) {
      console.error("수강신청 거절 실패", e);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            수강신청 관리
          </Typography>
          <Typography variant="body2" color="text.secondary">
            현재 운영 중인 시설 강좌에 들어온 수강신청을 승인/거절할 수
            있습니다.
          </Typography>
        </Box>
      </Box>

      {/* 테이블 영역 */}
      <Box
        sx={{
          mt: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "auto",
          maxHeight: 480,
          "&::-webkit-scrollbar": { width: 6, height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(0,0,0,0.2)",
            borderRadius: 3,
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell align="center" sx={{ minWidth: 70 }}>
                  신청 ID
                </TableCell>
                <TableCell sx={{ minWidth: 220 }}>강좌명</TableCell>
                <TableCell align="center" sx={{ minWidth: 60 }}>
                  세션
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 90 }}>
                  수업일
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 110 }}>
                  신청자
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>
                  연락처
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 90 }}>
                  상태
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 110 }}>
                  신청일
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>
                  액션
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(!list || list.length === 0) && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      승인 대기 중인 수강신청이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {list.map((row) => (
                <TableRow
                  key={row.enrollmentId}
                  hover
                  sx={{
                    "&:last-of-type td": { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                  >
                    {row.enrollmentId}
                  </TableCell>

                  <TableCell sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {row.courseTitle}
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                    {row.sessionId}
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                    {row.date}
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "0.85rem" }}>
                    {row.name} ({row.username})
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                    {row.phone || "-"}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={STATUS_LABEL[row.status] || row.status}
                      color={STATUS_COLOR[row.status] || "default"}
                      sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                    {row.createdAt ? dateFormat(row.createdAt) : "-"}
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title="승인">
                        <span>
                          <IconButton
                            size="small"
                            color="success"
                            disabled={row.status !== "REQUESTED"}
                            onClick={() => handleApprove(row.enrollmentId)}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="거절">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={row.status !== "REQUESTED"}
                            onClick={() => handleReject(row.enrollmentId)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Paper>
  );
}
