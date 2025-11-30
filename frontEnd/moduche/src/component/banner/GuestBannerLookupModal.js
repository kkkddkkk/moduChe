import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { useState } from "react";

export default function GuestBannerLookupModal({
    open,
    onClose,
    onConfirm, // (email, password) => void
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleConfirm = () => {
        if (!email.trim() || !password.trim()) {
            alert("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }
        onConfirm(email, password);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>비회원 배너 신청 조회</DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="이메일 주소"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        type="email"
                    />

                    <TextField
                        label="사용 비밀번호"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="신청 시 설정한 비밀번호"
                    />

                    <Typography variant="caption" color="text.secondary">
                        * 비회원 신청 시 입력한 이메일과 비밀번호로 조회할 수 있습니다.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                >
                    닫기
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                >
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}
