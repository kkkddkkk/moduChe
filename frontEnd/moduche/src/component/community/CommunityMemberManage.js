import {
    Typography,
    Paper,
    Box,
    Pagination,
    Stack,
    Select,
    MenuItem,
    Button,
    TextField,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";

import { useEffect, useState } from "react";

import MemberCard from "./MemberCard";
import { SlideModal, NormalModalExpand } from "../common/Modals";

import {
    getMemberList,
    updateRole,
    suspendMember,
    activateMember,
    quitMemberOwner,
} from "../../api/communityAPI/communityAPI";
import { OneAlignedButton } from "../common/Button";
import { SubTitle } from "../common/Text";
import { formattedDate } from "./utility/communityUtility";

const CommunityMemberManage = ({ communityId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [members, setMembers] = useState([]);
    const [status, setStatus] = useState("ACTIVE");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 모달 제어
    const [confirmOpen, setConfirmOpen] = useState(false); // 정지·복구·탈퇴
    const [roleModalOpen, setRoleModalOpen] = useState(false); // 역할 변경
    const [detailOpen, setDetailOpen] = useState(false); // 상세 정보 (슬라이드)

    const [modalActionType, setModalActionType] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [newRole, setNewRole] = useState("");

    const [suspendReason, setSuspendReason] = useState("");

    // ---------- Dummy ----------
    const createDummyMembers = () => {
        const dummy = [];
        for (let i = 1; i <= 20; i++) {
            dummy.push({
                memberId: i,
                name: `회원 ${i}`,
                role: i % 3 === 0 ? "MANAGER" : "MEMBER",
                status:
                    i % 5 === 0 ? "QUIT" : i % 4 === 0 ? "SUSPENDED" : "ACTIVE",

                joinedAt: "2025-01-01",

                quitReason: i % 5 === 0 ? "개인 사정으로 탈퇴했습니다." : null,
                quitAt: i % 5 === 0 ? "2025-02-01" : null,

                suspendedAt: i % 4 === 0 ? "2025-01-20" : null,
                suspendedReason: i % 4 === 0 ? "규정 위반" : null,
            });
        }
        return dummy;
    };

    const loadData = async () => {
        try {
            const data = await getMemberList(communityId, status, page - 1, 6);

            setMembers(data.content);
            setTotalPages(data.totalPages);
        } catch (e) {
            console.error("서버 오류 → dummy 사용", e);

            const dummy = createDummyMembers().filter(
                (m) => m.status === status
            );

            const pageSize = 6;
            const start = (page - 1) * pageSize;

            setMembers(dummy.slice(start, start + pageSize));
            setTotalPages(Math.ceil(dummy.length / pageSize));
        }
    };

    useEffect(() => {
        loadData();
    }, [communityId, search, status, page]);

    // ---------- 역할 변경 ----------
    const openRoleModal = (member) => {
        setSelectedMember(member);
        setNewRole(member.role);
        setRoleModalOpen(true);
    };

    const saveRole = async () => {
        try {
            await updateRole(communityId, selectedMember.memberId, newRole);
        } catch (e) {
            console.error("역할 변경 실패", e);
        }
        setRoleModalOpen(false);
        loadData();
    };

    // ---------- 정지/복구/탈퇴 ----------
    const openConfirm = (member, action) => {
        setSelectedMember(member);
        setModalActionType(action);
        setSuspendReason("");
        setConfirmOpen(true);
    };

    const executeAction = async () => {
        if (!selectedMember) return;
        const id = selectedMember.memberId;

        console.log(
            "communityId: " +
                communityId +
                ", memberId: " +
                id +
                " , suspendReason: " +
                suspendReason +
                ", modalActionType: " +
                modalActionType
        );
        try {
            if (modalActionType === "suspend") {
                //정지처리 사유 필요.
                await suspendMember(communityId, id, suspendReason);
            } else if (modalActionType === "activate") {
                //활성 처리, 사유 없음.
                await activateMember(communityId, id);
            } else if (modalActionType === "quit") {
                // 탈퇴 처리, 사유 필요.
                await quitMemberOwner(communityId, id, suspendReason);
            }
        } catch (e) {
            console.error("회원 제어 실패", e);
        }

        setConfirmOpen(false);
        loadData();
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
                    placeholder="회원 이름 검색"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* 상태 필터 */}
                <Box sx={{ mb: 2 }}>
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
                </Box>
            </Box>

            {members.length === 0 ? (
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
                    아직 가입 된 동아리 회원이 없습니다.
                </Box>
            ) : (
                <>
                    {/* 카드 리스트 */}
                    <Stack spacing={2} sx={{ flex: 1 }}>
                        {members.map((member) => (
                            <MemberCard
                                key={member.memberId}
                                member={member}
                                onRole={openRoleModal}
                                onSuspend={(m) => openConfirm(m, "suspend")}
                                onActivate={(m) => openConfirm(m, "activate")}
                                onDelete={(m) => openConfirm(m, "quit")}
                                onDetail={(m) => {
                                    setSelectedMember(m);
                                    setDetailOpen(true);
                                }}
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
                            onChange={(e, v) => setPage(v)}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            {/*역할 변경 모달 — 일반 모달 */}
            <NormalModalExpand
                open={roleModalOpen}
                close={() => setRoleModalOpen(false)}
                title="역할 변경"
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
                                해당 사용자의 새로운 등급을 선택해주세요.
                            </Typography>
                            <Typography
                                fontSize="0.9rem"
                                sx={{
                                    mb: 5,
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                * 등급 변경 내역은 사용자가 확인할 수 있습니다.
                            </Typography>
                            <Select
                                fullWidth
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <MenuItem value="ADMIN">운영자</MenuItem>
                                <MenuItem value="MANAGER">매니저</MenuItem>
                                <MenuItem value="MEMBER">일반 회원</MenuItem>
                            </Select>
                        </Box>

                        <Divider
                            sx={{ mt: modalActionType === "activate" ? 9 : 3 }}
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
                                onClick={() => setRoleModalOpen(false)}
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
                                onClick={saveRole}
                            >
                                확인
                            </OneAlignedButton>
                        </Stack>
                    </Box>
                }
            />

            {/* 정지/복구(/탈퇴) 확인 모달 */}
            <NormalModalExpand
                open={confirmOpen}
                close={() => setConfirmOpen(false)}
                title={
                    <SubTitle>
                        {modalActionType === "suspend"
                            ? "활동 정지"
                            : "활동 복구"}
                    </SubTitle>
                }
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
                        {modalActionType === "suspend" ? (
                            <>
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
                                        해당 사용자의 동아리 내부 활동을
                                        정지하시겠습니까?
                                    </Typography>
                                    <Typography
                                        fontSize="0.9rem"
                                        sx={{
                                            mb: 2,
                                            color: (theme) =>
                                                theme.palette.text.secondary,
                                        }}
                                    >
                                        * 정지 사유는 정지된 사용자가 열람할 수
                                        있습니다.
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={suspendReason}
                                    onChange={(e) =>
                                        setSuspendReason(e.target.value)
                                    }
                                    placeholder="정지 사유 입력"
                                />
                            </>
                        ) : modalActionType === "activate" ? (
                            <>
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
                                    <Typography sx={{ mt: 4, mb: 1 }}>
                                        해당 회원을 재활성화하시겠습니까?
                                    </Typography>
                                    <Typography
                                        fontSize="0.9rem"
                                        sx={{
                                            mb: 2,
                                            color: (theme) =>
                                                theme.palette.text.secondary,
                                        }}
                                    >
                                        * 재활성화 시 동아리 내부 콘텐츠 이용이
                                        가능합니다.
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            // 탈퇴
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                <Typography sx={{ mt: 4 }}>
                                    해당 회원을 탈퇴 처리하시겠습니까?
                                </Typography>
                            </Box>
                        )}

                        <Divider
                            sx={{ mt: modalActionType === "activate" ? 9 : 3 }}
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

            {/* 상세 정보 슬라이드 모달 */}
            <SlideModal
                open={detailOpen}
                close={() => setDetailOpen(false)}
                position={isMobile ? "bottom" : "right"}
                width="30"
                title={<Typography variant="h6">회원 상세 정보</Typography>}
            >
                {selectedMember && (
                    <Box sx={{ mt: 2, p: 1, width: "100%" }}>
                        {/* ACTIVE & SUSPENDED → 기본 정보 */}
                        {(selectedMember.status === "ACTIVE" ||
                            selectedMember.status === "SUSPENDED") && (
                            <>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6">
                                        회원 정보
                                    </Typography>
                                </Box>
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>이름:</strong> {selectedMember.name}
                                </Typography>
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>등급:</strong>{" "}
                                    {selectedMember.role === "MEMBER"
                                        ? "일반 회원"
                                        : selectedMember.role === "MANAGER"
                                        ? "매니저"
                                        : "운영자"}
                                </Typography>
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>가입일:</strong>{" "}
                                    {formattedDate(selectedMember.joinedAt)}
                                </Typography>
                            </>
                        )}

                        {/* SUSPENDED 추가 정보 */}
                        {selectedMember.status === "SUSPENDED" && (
                            <>
                                <Divider sx={{ width: "100%", my: 2 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6">
                                        정지 정보
                                    </Typography>
                                </Box>
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>정지일:</strong>{" "}
                                    {formattedDate(selectedMember.suspendedAt)}
                                </Typography>
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ mb: 1 }}
                                >
                                    <strong>정지 사유:</strong>{" "}
                                    {selectedMember.suspendReason}
                                </Typography>
                            </>
                        )}

                        {/* QUIT 회원은 개인정보 숨김 */}
                        {selectedMember.status === "QUIT" && (
                            <>
                                <Typography sx={{ mb: 1 }}>
                                    이 회원은 탈퇴한 회원입니다.
                                </Typography>

                                <Typography sx={{ mb: 1 }}>
                                    <strong>탈퇴일:</strong>{" "}
                                    {selectedMember.quitAt}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>탈퇴 사유:</strong>{" "}
                                    {selectedMember.quitReason}
                                </Typography>
                            </>
                        )}
                    </Box>
                )}
            </SlideModal>
        </Paper>
    );
};

export default CommunityMemberManage;
