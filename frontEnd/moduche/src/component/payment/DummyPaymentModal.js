import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
} from "@mui/material";
import { useState } from "react";

const DummyPaymentModal = ({ open, data, onFail, onSuccess }) => {
    
    const [method, setMethod] = useState("CARD");
    
    if (!data) return null;

    const paymentId = data.id;
    const bannerTypeId = data.bannerTypeId;
    const amount = data.amount;

    console.log(data);

    const confirmPayment = {
        paymentId,
        bannerTypeId,
        method,
        amount,
        status: "PAID", // 더미 결제는 무조건 성공.
    };

    const failPayment = {
        paymentId,
        bannerTypeId,
        method,
        amount,
        status: "FAILED",
    };

    const handleConfirm = () => {
        onSuccess(confirmPayment);
    };

    const handleCancel = () => {
        onFail(failPayment);
    };

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogTitle>결제하기</DialogTitle>

            <DialogContent>
                {/* 결제 금액 */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    결제 금액
                </Typography>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    sx={{ mb: 2 }}
                >
                    {Number(amount).toLocaleString()} 원
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* 결제 수단 선택 */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    결제 수단 선택
                </Typography>

                <RadioGroup
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <FormControlLabel
                        value="CARD"
                        control={<Radio />}
                        label="신용/체크카드"
                    />
                    <FormControlLabel
                        value="ACCOUNT"
                        control={<Radio />}
                        label="계좌이체"
                    />
                    <FormControlLabel
                        value="MOBILE"
                        control={<Radio />}
                        label="휴대폰 결제"
                    />
                </RadioGroup>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCancel} color="inherit">
                    취소하기
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                >
                    결제하기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DummyPaymentModal;
