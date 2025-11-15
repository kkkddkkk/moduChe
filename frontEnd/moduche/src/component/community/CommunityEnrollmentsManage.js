import {
    Typography,
    Paper,
    Box,
    Pagination,
    Stack,
    useTheme,
    useMediaQuery,
    TextField,
    Divider,
} from "@mui/material";

import {
    getEnrollmentList,
    approveEnrollment,
    denyEnrollment,
} from "../../api/communityAPI/communityAPI";

import { useEffect, useState } from "react";
import { NormalModal, SlideModal } from "../common/Modals";
import { SubTitle } from "../common/Text";
import { OneAlignedButton } from "../common/Button";
import EnrollmentCard from "./EnrollmentCard";

const CommunityEnrollmentsManage = ({ communityId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [enrollments, setEnrollments] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [denyReason, setDenyReason] = useState("");

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const createDummyEnrollments = () => {
        const dummy = [];
        for (let i = 1; i <= 20; i++) {
            dummy.push({
                enrollmentId: i,
                name: `지원자 ${i}`,
                contact: `010-0000-${String(i).padStart(4, "0")}`,
                introduction: `안녕하세요, 저는 ${i}번 지원자입니다.`,
                motivation:
                    i % 3 === 0
                        ? "동아리 활동을 통해 다양한 사람들과 함께 성장하고 싶습니다."
                        : "동아리 활동에 적극적으로 참여하고 싶습니다.",
            });
        }
        return dummy;
    };

    const loadData = async () => {
        try {
            const data = await getEnrollmentList(
                communityId,
                "PENDING",
                page - 1,
                5
            );

            //정상 응답.
            if (
                data &&
                Array.isArray(data.content) &&
                data.content.length > 0
            ) {
                setEnrollments(data.content);
                setTotalPages(data.totalPages);
                return;
            } else {
                //더미 데이터 출력용.
                // const dummy = createDummyEnrollments();
                // const pageSize = 5;
                // const startIdx = (page - 1) * pageSize;

                // setEnrollments(dummy.slice(startIdx, startIdx + pageSize));
                // setTotalPages(Math.ceil(dummy.length / pageSize));
            }
        } catch (e) {
            console.error("가입 요청 조회 실패:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [communityId, page]);

    const executeAction = async () => {
        if (actionType === "approve") {
            await approveEnrollment(communityId, targetId);
        } else if (actionType === "deny") {
            await denyEnrollment(communityId, targetId, denyReason);
            setDenyReason("");
        }

        setConfirmOpen(false);
        loadData();
    };

    const openApproveModal = (id) => {
        setTargetId(id);
        setActionType("approve");
        setConfirmOpen(true);
    };

    const openDenyModal = (id) => {
        setTargetId(id);
        setActionType("deny");
        setConfirmOpen(true);
    };

    const handleDetail = (row) => {
        setSelectedEnrollment(row);
        setDetailOpen(true);
    };

    return (
        <Paper
            sx={{
                p: 3,
                minHeight: "560px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <TextField
                    placeholder="신청자 이름 검색"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* 상태 필터 */}
                {/* <Box sx={{ mb: 2 }}>
                    <Select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                    >
                        <MenuItem value="ACTIVE">활동 중</MenuItem>
                        <MenuItem value="SUSPENDED">정지됨</MenuItem>
                        <MenuItem value="QUIT">탈퇴함</MenuItem>
                    </Select>
                </Box> */}
            </Box>

            {enrollments.length === 0 ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        fontSize: "1.1rem",
                    }}
                >
                    아직 대기 중인 가입 신청이 없습니다.
                </Box>
            ) : (
                <>
                    {/* 카드 리스트 */}
                    <Stack spacing={2} sx={{ flex: 1 }}>
                        {enrollments.map((req) => (
                            <EnrollmentCard
                                key={req.enrollmentId}
                                req={req}
                                onDetail={handleDetail}
                                onApprove={openApproveModal}
                                onDeny={openDenyModal}
                            />
                        ))}
                    </Stack>

                    {/* 페이지네이션 */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            {/* 승인/거절 모달 — 기존 유지 */}
            <NormalModal
                open={confirmOpen}
                close={() => setConfirmOpen(false)}
                title={
                    <SubTitle>
                        {actionType === "approve" ? "가입 승인" : "가입 거절"}
                    </SubTitle>
                }
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
                        {actionType === "approve" && (
                            <>
                                <Typography sx={{ mt: 4, mb: 1 }}>
                                    {" "}
                                    해당 사용자의 동아리 가입을
                                    승인하시겠습니까?{" "}
                                </Typography>{" "}
                                <Typography
                                    fontSize="0.9rem"
                                    sx={{
                                        mb: 2,
                                        color: (theme) =>
                                            theme.palette.text.secondary,
                                    }}
                                >
                                    {" "}
                                    *가입 승인을 받으면 동아리 내부 콘텐츠를
                                    자유롭게 이용할 수 있습니다.{" "}
                                </Typography>
                            </>
                        )}
                        {actionType === "deny" && (
                            <>
                                <Typography sx={{ mb: 1 }}>
                                    {" "}
                                    해당 사용자의 동아리 거절 사유를
                                    입력해주세요.{" "}
                                </Typography>{" "}
                                <Typography
                                    fontSize="0.9rem"
                                    sx={{
                                        mb: 2,
                                        color: (theme) =>
                                            theme.palette.text.secondary,
                                    }}
                                >
                                    {" "}
                                    *거절 사유는 내부용으로만 사용되며,
                                    신청자에게는 공개되지 않습니다.{" "}
                                </Typography>{" "}
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={denyReason}
                                    onChange={(e) =>
                                        setDenyReason(e.target.value)
                                    }
                                    sx={{ mt: 2 }}
                                    placeholder="거절 사유 입력"
                                />
                            </>
                        )}
                    </Box>

                    <Divider
                        sx={{ mt: actionType === "approve" ? 9 : 1 }}
                    />
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
                            onClick={() => setConfirmOpen(false)}
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
                            onClick={executeAction}
                        >
                            {" "}
                            확인{" "}
                        </OneAlignedButton>
                    </Stack>
                </Box>
            </NormalModal>

            <SlideModal
                open={detailOpen}
                close={() => setDetailOpen(false)}
                position={isMobile ? "bottom" : "right"}
                width="30"
                title={<Typography variant="h6">가입 신청 상세</Typography>}
            >
                {" "}
                {selectedEnrollment && (
                    <Box sx={{ mt: 2 }}>
                        {" "}
                        <Typography sx={{ mb: 1 }}>
                            {" "}
                            <strong>이름:</strong> {selectedEnrollment.name}{" "}
                        </Typography>{" "}
                        <Typography sx={{ mb: 1 }}>
                            {" "}
                            <strong>연락처:</strong>{" "}
                            {selectedEnrollment.contact}{" "}
                        </Typography>{" "}
                        <Typography sx={{ mb: 1 }}>
                            {" "}
                            <strong>한줄 소개:</strong>{" "}
                            {selectedEnrollment.introduction}{" "}
                        </Typography>{" "}
                        <Typography sx={{ mb: 1 }}>
                            {" "}
                            <strong>지원 동기:</strong>{" "}
                            {selectedEnrollment.motivation}{" "}
                        </Typography>{" "}
                    </Box>
                )}{" "}
            </SlideModal>
        </Paper>
    );
};

export default CommunityEnrollmentsManage;
