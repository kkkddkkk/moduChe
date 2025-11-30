// src/pages/Course/EnrollModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { Users } from "lucide-react";
import { postCourseEnroll } from "../../api/courseAPI";

export default function EnrollModal({
  open,
  onClose,
  course,
  courseId,
  sessionId,
  date,
  user,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  if (!course) {
    // course 아직 안 로딩됐으면 모달 자체를 그리지 않음
    return null;
  }

  const handleSubmit = async () => {
    if (!courseId || !sessionId || !date) {
      alert("회차와 날짜를 먼저 선택해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      console.log("[EnrollModal] submit", { courseId, sessionId, date });
      await postCourseEnroll(courseId, {
        sessionId,
        date, // "YYYY-MM-DD"
      });

      if (onSuccess) {
        onSuccess();
      } else {
        onClose?.();
      }
      alert("수강 신청이 접수되었습니다.");
    } catch (e) {
      console.error("수강신청 실패", e);
      const msg =
        e.response?.data?.message ||
        e.message ||
        "수강 신청 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const session = course.sessions?.find((s) => s.id === sessionId) ?? null;

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>수강 신청 확인</DialogTitle>

      <DialogContent dividers>
        {/* 강좌 기본 정보 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            강좌명
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {course.titleText}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.bylineOrg} · {course.locationText}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 회차 / 날짜 / 정원 */}
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              회차
            </Typography>
            <Typography variant="body1">
              {session ? session.label ?? `${session.id}회차` : "-"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              날짜
            </Typography>
            <Typography variant="body1">{date || "-"}</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
            >
              <Users style={{ width: 16, height: 16 }} />
              정원
            </Typography>
            <Typography variant="body1">
              {course.maxParticipants ?? "-"} 명
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* 신청자 정보 */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            신청자 정보
          </Typography>
          {user ? (
            <Box sx={{ fontSize: "0.95rem" }}>
              <Typography>이름: {user.name}</Typography>
              <Typography>아이디: {user.username}</Typography>
              <Typography>연락처: {user.phone}</Typography>
              <Typography>이메일: {user.email}</Typography>
            </Box>
          ) : (
            <Typography color="text.secondary" variant="body2">
              로그인 정보를 불러올 수 없습니다.
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            신청 버튼을 누르면 시설 운영자의 승인 후 최종 확정됩니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !sessionId || !date}
        >
          {submitting ? "신청 중..." : "수강 신청"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
