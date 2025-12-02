import { useState } from "react";
import {NormalModal} from "../common/Modals";
import { SubTitle } from "../common/Text";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { OneAlignedButton } from "../common/Button";

const RejectReasonModal = ({open, onClose, onConfirm}) => {

    const [reason, setReason] = useState("");
    return (
        <NormalModal
            open={open}
            close={onClose}
            title={<SubTitle>배너 승인 거절</SubTitle>}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // 상하 균등 분배
                    height: "100%", // 모달 높이 전체 사용
                    p: 1,
                    pt: 0,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        textAlign: "center",
                        mb: 2,
                    }}
                >
                    <Typography sx={{ mb: 1 }}>
                        {" "}
                        해당 사용자의 동아리 거절 사유를 입력해주세요.{" "}
                    </Typography>{" "}
                    <Typography
                        fontSize="0.9rem"
                        sx={{
                            mb: 2,
                            color: (theme) => theme.palette.text.secondary,
                        }}
                    >
                        {" "}
                        *거절 사유는 내부용으로만 사용되며, 신청자에게는
                        공개되지 않습니다.{" "}
                    </Typography>{" "}
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="거절 사유 입력"
                    />
                </Box>

                <Divider sx={{ mt: 1 }} />
                <Stack
                    direction={"row"}
                    sx={{
                        display: "flex",
                        width: "100%",
                        mt: 3,
                    }}
                >
                    <OneAlignedButton
                        variant="outlined"
                        sx={{
                            height: "48px",
                            width: "100%",
                            borderRadius: "5px",
                        }}
                        buttonWrapperSx={{ width: "95%" }}
                        onClick={onClose}
                    >
                        {" "}
                        취소{" "}
                    </OneAlignedButton>
                    <OneAlignedButton
                        variant="contained"
                        sx={{
                            height: "48px",
                            width: "100%",
                            borderRadius: "5px",
                        }}
                        buttonWrapperSx={{ width: "95%" }}
                        onClick={()=> onConfirm(reason)}
                    >
                        {" "}
                        확인{" "}
                    </OneAlignedButton>
                </Stack>
            </Box>
        </NormalModal>
    );
};
export default RejectReasonModal;
