import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import MyCommunityCard from "./MyCommunityCard";
import { NormalModalExpand, SlideModal } from "../common/Modals";
import { SubTitle } from "../common/Text";
import { OneAlignedButton } from "../common/Button";
import {
    fetchMyCommunityList,
    quitMemberSelf,
} from "../../api/communityAPI/communityAPI";
import { formattedDate } from "./utility/communityUtility";
import { useNavigate } from "react-router-dom";

const CommunityUserManage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    //가입된 동아리 목록.
    const [community, setCommunity] = useState([]);
    //목록 내 선택된 동아리.
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    //모달 팝업 제거 변수.
    const [detailOpen, setDetailOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [quitReason, setQuitReason] = useState("");

    const [search, setSearch] = useState("");
    const [activeOnly, setActiveOnly] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const createDummyCommunity = () => {
        const dummy = [];
        for (let i = 1; i <= 20; i++) {
            dummy.push({
                communityId: i,
                name: `랜덤한 동아리 이름 울랄라 히히 ${i}`,
                ownerName: "홍길동",
                joinedAt: `2025.11.$${i}`,
                createdAt: `2024.10.$${i}`,
                status:
                    i % 3 == 0 ? "ACTIVE" : i % 3 == 1 ? "SUSPENDED" : "QUIT",
                role: i % 2 == 0 ? "MANAGER" : "MEMBER",
            });
        }
        return dummy;
    };

    const loadData = async () => {
        try {
            // 실제 API 호출
            const data = await fetchMyCommunityList(
                page - 1,
                5,
                activeOnly,
                search
            );

            // 정상 응답인 경우
            if (
                data &&
                data.content &&
                Array.isArray(data.content) &&
                data.content.length >= 0
            ) {
                setCommunity(data.content);
                setTotalPages(data.totalPages);
                return;
            }
        } catch (e) {
            console.error("가입 요청 조회 실패:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, activeOnly, search]);

    const executeAction = async () => {
        if (!selectedCommunity) return;
        const communityId = selectedCommunity.communityId;
        try {
            await quitMemberSelf(communityId, quitReason);
        } catch (e) {
            console.error("회원 탈퇴 실패", e);
        }

        setConfirmOpen(false);
        loadData();
    };

    const openConfirm = (community) => {
        setSelectedCommunity(community);
        setQuitReason("");
        setConfirmOpen(true);
    };

    const openDetail = (community) => {
        setSelectedCommunity(community);
        setDetailOpen(true);
    };

    return (
        <>
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
                        placeholder="동아리 이름 검색"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={activeOnly === false} // false = 모든 상태 포함
                                onChange={(e) => setActiveOnly(!activeOnly)}
                            />
                        }
                        label="탈퇴 포함"
                    />
                </Box>
                {community.length === 0 ? (
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
                            {community.map((data) => (
                                <MyCommunityCard
                                    key={data.communityId}
                                    data={data}
                                    onQuit={(c) => openConfirm(c)}
                                    onDetail={(c) => openDetail(c)}
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

                {/* 탈퇴  모달 */}
                <NormalModalExpand
                    open={confirmOpen}
                    close={() => setConfirmOpen(false)}
                    title={<SubTitle>동아리 탈퇴</SubTitle>}
                    content={
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                p: 1,
                                pt: 0,
                            }}
                        >
                            {/* 탈퇴 */}
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
                                    해당 동아리를 탈퇴하시겠습니까?
                                </Typography>
                                <Typography
                                    fontSize="0.9rem"
                                    sx={{
                                        mb: 2,
                                        color: (theme) =>
                                            theme.palette.text.secondary,
                                    }}
                                >
                                    * 탈퇴 후 다시 가입하실 때에는 운영자의 승인
                                    절차가 다시 진행됩니다.
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                value={quitReason}
                                onChange={(e) => setQuitReason(e.target.value)}
                                placeholder="탈퇴 사유 입력"
                            />
                            <Divider
                                sx={{
                                    mt: 3,
                                }}
                            />
                            <Stack
                                direction={"row"}
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    mt: 3,
                                    justifyContent: "space-between",
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
                                    취소
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
                                    확인
                                </OneAlignedButton>
                            </Stack>
                        </Box>
                    }
                />

                <SlideModal
                    open={detailOpen}
                    close={() => setDetailOpen(false)}
                    position={isMobile || isTablet ? "bottom" : "right"}
                    width="30"
                    height="60"
                >
                    {selectedCommunity && (
                        <Box sx={{ mt: 2, p: 1, width: "100%" }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    동아리 정보
                                </Typography>
                            </Box>
                            <Typography
                                color={theme.palette.text.secondary}
                                sx={{ mb: 1 }}
                            >
                                <strong>이름:</strong> {selectedCommunity.name}
                            </Typography>
                            <Typography
                                color={theme.palette.text.secondary}
                                sx={{ mb: 1 }}
                            >
                                <strong>운영자:</strong>{" "}
                                {selectedCommunity.ownerName}
                            </Typography>
                            <Typography
                                color={theme.palette.text.secondary}
                                sx={{ mb: 1 }}
                            >
                                <strong>개설일:</strong>{" "}
                                {formattedDate(selectedCommunity.createdAt)}
                            </Typography>

                            <Divider sx={{ width: "100%", my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    내 가입 정보
                                </Typography>
                            </Box>
                            {!selectedCommunity.status === "QUIT" && (
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>등급:</strong>{" "}
                                    {selectedCommunity.role === "MEMBER"
                                        ? "일반 회원"
                                        : selectedCommunity.role === "MANAGER"
                                        ? "매니저"
                                        : "운영자"}
                                </Typography>
                            )}

                            <Typography
                                color={theme.palette.text.secondary}
                                sx={{ mb: 1 }}
                            >
                                <strong>계정 상태:</strong>{" "}
                                {selectedCommunity.status === "ACTIVE"
                                    ? "활동 중"
                                    : selectedCommunity.status === "QUIT"
                                    ? "탈퇴"
                                    : "계정 정지"}
                            </Typography>
                            {selectedCommunity.status === "QUIT" ? (
                                <>
                                    <Typography
                                        color={theme.palette.text.secondary}
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>탈퇴일:</strong>{" "}
                                        {formattedDate(
                                            selectedCommunity.quitAt
                                        )}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        color={theme.palette.text.secondary}
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>가입일:</strong>{" "}
                                        {formattedDate(
                                            selectedCommunity.joinedAt
                                        )}
                                    </Typography>

                                    <Divider sx={{ width: "100%", my: 2 }} />

                                    <OneAlignedButton
                                        variant="contained"
                                        sx={{
                                            height: "48px",
                                            width: "100%",
                                            borderRadius: "5px",
                                        }}
                                        buttonWrapperSx={{ width: "95%" }}
                                        onClick={() =>
                                            navigate(
                                                `/community/details/${selectedCommunity.communityId}`
                                            )
                                        }
                                    >
                                        동아리 게시글 보러가기
                                    </OneAlignedButton>
                                </>
                            )}
                        </Box>
                    )}
                </SlideModal>
            </Paper>
        </>
    );
};
export default CommunityUserManage;
