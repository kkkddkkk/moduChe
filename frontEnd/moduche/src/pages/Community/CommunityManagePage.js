import { useState, useEffect } from "react";
import {
    Box,
    Tabs,
    Tab,
    Grid,
    useTheme,
    useMediaQuery,
    MenuItem,
    Select,
    Typography,
    Button,
    Stack,
    Chip,
    alpha,
} from "@mui/material";
import { getMyCommunities } from "../../api/communityAPI/communityAPI";

import CommunityEnrollmentsManage from "../../component/community/CommunityEnrollmentsManage";
import CommunityMemberManage from "../../component/community/CommunityMemberManage";
import CommunityPostManage from "../../component/community/CommunityPostManage";
import CommunityMetaManage from "../../component/community/CommunityMetaManage";
import CommunityManageSelectModal from "../../component/community/CommunityManageSelectModal";
import { CenterTitle } from "../../component/common/Text";
import { SquareArrowRight, SquareCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, isTokenExpired } from "../../utils/auth";
import ConfirmModal from "../../component/community/ConfirmModal";
import Loading from "../../component/common/Loading";

const CommunityManagePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    //공용 모달 제어용.
    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState("안내");
    const [modalContent, setModalContent] = useState("내용");
    const [modalEvent, setModalEvent] = useState(() => {});

    //로딩처리.
    const [loading, setLoading] = useState(true);

    const [tab, setTab] = useState(0);
    const [communityList, setCommunityList] = useState([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    // 운영자 동아리 목록 조회
    useEffect(() => {
        //로그인, 엑세스 토큰 먼저 확인.
        if (!isLoggedIn()) {
            setLoading(false);
            setOpenConfirm(true);
            setModalTitle("잘못된 접근");
            setModalContent(
                "로그인이 필요한 서비스입니다.\n로그인 후 이용하실 수 있습니다."
            );
            setModalEvent(() => () => navigate("/account/login"));
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token || isTokenExpired(token)) {
            setLoading(false);
            setOpenConfirm(true);
            setModalTitle("로그인 만료");
            setModalContent(
                "로그인이 만료 되었습니다.\n재로그인 후 이용하실 수 있습니다."
            );
            setModalEvent(() => () => navigate("/account/login"));
            return;
        }

        const loadCommunities = async () => {
            try {
                const res = await getMyCommunities();
                setCommunityList(res);
                
                // 첫 번째 동아리를 기본 선택
                if (res.length > 0) {
                    setSelectedCommunityId(res[0].communityId);
                }
                setLoading(false);
            } catch (e) {
                setLoading(false);
                console.error("내 동아리 조회 실패:", e);
                setSelectedCommunityId(1);
            }
        };

        loadCommunities();
    }, []);

    const commonTabStyle = (isMobile, theme, isActive) => ({
        alignItems: "flex-start",
        fontSize: isMobile ? "0.9rem" : "1.15rem",
        fontWeight: isActive ? 600 : 500,
        textAlign: isMobile || isTablet ? "center" : "left",
        minHeight: 48,
    });

    const selectedCommunity = communityList.find(
        (c) => c.communityId === selectedCommunityId
    );
    return (
        <Grid size={12} sx={{ p: 2 }}>
            {/* 선택된 동아리 표시 */}
            <Stack
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={2}
            >
                <Stack
                    display={"flex"}
                    direction={"row"}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    spacing={2}
                >
                    {selectedCommunity && (
                        <>
                            <Box
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                alignContent={"center"}
                                gap={2}
                            >
                                <Box
                                    alignContent={"center"}
                                    border={`1px solid ${theme.palette.primary.main}`}
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                    }}
                                    borderRadius={"55px"}
                                >
                                    <Typography
                                        alignSelf={"center"}
                                        color={theme.palette.primary.main}
                                        fontSize={"1.15rem"}
                                        fontWeight={"450"}
                                    >
                                        현재 선택:{" "}
                                        <strong>
                                            {selectedCommunity.name}
                                        </strong>
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenSelectModal(true)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                    }}
                                >
                                    <SquareCheck size={16} />
                                    동아리 선택
                                </Button>
                            </Box>
                        </>
                    )}
                </Stack>
                {/* 탭 */}
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    variant="scrollable"
                >
                    <Tab
                        label="가입 요청"
                        sx={commonTabStyle(isMobile, theme, tab === 0)}
                    />
                    <Tab
                        label="동아리 회원 관리"
                        sx={commonTabStyle(isMobile, theme, tab === 1)}
                    />
                    <Tab
                        label="모집 게시글"
                        sx={commonTabStyle(isMobile, theme, tab === 2)}
                    />
                    <Tab
                        label="기본 정보"
                        sx={commonTabStyle(isMobile, theme, tab === 3)}
                    />
                </Tabs>
            </Stack>

            {/* 동아리 선택 팝업 */}
            <CommunityManageSelectModal
                open={openSelectModal}
                onClose={() => setOpenSelectModal(false)}
                communities={communityList}
                onSelect={(id) => {
                    setSelectedCommunityId(id);
                    setOpenSelectModal(false);
                }}
            />

            <Box sx={{ mt: 3 }}>
                {/* communityId 없이 렌더링하면 에러 → 보호 처리 */}
                {selectedCommunityId && (
                    <>
                        {tab === 0 && (
                            <CommunityEnrollmentsManage
                                communityId={selectedCommunityId}
                            />
                        )}
                        {tab === 1 && (
                            <CommunityMemberManage
                                communityId={selectedCommunityId}
                            />
                        )}
                        {tab === 2 && (
                            <CommunityPostManage
                                communityId={selectedCommunityId}
                            />
                        )}
                        {tab === 3 && (
                            <CommunityMetaManage
                                communityId={selectedCommunityId}
                            />
                        )}
                    </>
                )}
            </Box>

            <ConfirmModal
                open={openConfirm}
                title={modalTitle}
                content={modalContent}
                onConfirm={modalEvent}
                onClose={() => setOpenConfirm(false)}
                isNoEscape={true}
                isOneBtn={true}
            />

            <Loading open={loading} text="동아리 정보를 불러오고 있습니다." />
        </Grid>
    );
};

export default CommunityManagePage;
