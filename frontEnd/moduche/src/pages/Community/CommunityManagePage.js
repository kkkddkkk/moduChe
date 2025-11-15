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
} from "@mui/material";
import { getMyCommunities } from "../../api/communityAPI/communityAPI";

import CommunityEnrollmentsManage from "../../component/community/CommunityEnrollmentsManage";
import CommunityMemberManage from "../../component/community/CommunityMemberManage";
import CommunityPostManage from "../../component/community/CommunityPostManage";
import CommunityManageSelectModal from "../../component/community/CommunityManageSelectModal";
import { CenterTitle } from "../../component/common/Text";

const CommunityManagePage = () => {
    const [tab, setTab] = useState(0);
    const [communityList, setCommunityList] = useState([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);

    const [openSelectModal, setOpenSelectModal] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    // 1) 운영자 동아리 목록 조회
    useEffect(() => {
        const loadCommunities = async () => {
            try {
                const res = await getMyCommunities();
                setCommunityList(res);

                // 첫 번째 동아리를 기본 선택
                if (res.length > 0) {
                    setSelectedCommunityId(res[0].communityId);
                }
            } catch (e) {
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
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    spacing={2}
                >
                    {selectedCommunity && (
                        <>
                            <Typography
                                fontSize={"1.15rem"}
                                color="theme.palette.text.secondary"
                                sx={{ textAlign: "center" }}
                            >
                                현재 선택된 동아리: {selectedCommunity.name}
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 1 }}
                                onClick={() => setOpenSelectModal(true)}
                            >
                                다른 동아리 선택
                            </Button>
                        </>
                    )}
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
                        label="회원 관리"
                        sx={commonTabStyle(isMobile, theme, tab === 1)}
                    />
                    <Tab
                        label="모집 게시글 관리"
                        sx={commonTabStyle(isMobile, theme, tab === 2)}
                    />
                </Tabs>

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
                        </>
                    )}
                </Box>
            </Grid>
    );
};

export default CommunityManagePage;
