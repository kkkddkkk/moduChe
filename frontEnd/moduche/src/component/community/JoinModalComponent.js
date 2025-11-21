import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { submitCommunityEnrollment } from "../../api/communityAPI/communityAPI"; // 파일 경로에 맞게 수정

const JoinModalComponent = ({ open, onClose, clubName, communityId }) => {
    const [form, setForm] = useState({
        name: "",
        contact: "",
        intro: "",
        reason: "",
    });

    const [submitting, setSubmitting] = useState(false); // 제출 중 여부

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return; // 더블클릭 방지

        setSubmitting(true);

        try {
            await submitCommunityEnrollment(communityId, {
                name: form.name,
                contact: form.contact,
                introduction: form.intro,
                motivation: form.reason,
            });

            alert(`${clubName} 가입 신청이 전송되었습니다.`);

            // 폼 초기화
            setForm({ name: "", contact: "", intro: "", reason: "" });

            // 모달 닫기
            onClose();
            window.location.reload();
        } catch (error) {
            alert("가입 신청 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={submitting ? null : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{clubName} 가입 신청</DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    아래 내용을 작성하여 동아리 가입을 신청해주세요.
                </Typography>

                <TextField
                    name="name"
                    label="이름"
                    fullWidth
                    required
                    disabled={submitting}
                    sx={{ mb: 2 }}
                    value={form.name}
                    onChange={handleChange}
                />

                <TextField
                    name="contact"
                    label="연락처"
                    fullWidth
                    required
                    disabled={submitting}
                    sx={{ mb: 2 }}
                    value={form.contact}
                    onChange={handleChange}
                />

                <TextField
                    name="intro"
                    label="한 줄 자기소개"
                    fullWidth
                    required
                    disabled={submitting}
                    sx={{ mb: 2 }}
                    value={form.intro}
                    onChange={handleChange}
                />

                <TextField
                    name="reason"
                    label="가입 동기"
                    multiline
                    minRows={3}
                    fullWidth
                    required
                    disabled={submitting}
                    value={form.reason}
                    onChange={handleChange}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>
                    취소
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={
                        submitting ? <CircularProgress size={18} /> : null
                    }
                >
                    {submitting ? "전송 중..." : "신청하기"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JoinModalComponent;
