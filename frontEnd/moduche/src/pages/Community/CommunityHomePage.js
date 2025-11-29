import {
    Box,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Loading from "../../component/common/Loading";
import ConfirmModal from "../../component/community/ConfirmModal";
import { useEffect, useState } from "react";
import { fetchCommunityList } from "../../api/communityAPI/communityAPI";
import { isLoggedIn, isTokenExpired } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import BannerLayout from "../../component/common/BannerLayout";
import CommunityHomeHeader from "../../component/community/CommunityHomeHeader";
import QuickSearchBar from "../../pages/Course/QuickSearchBar";
import PostAreaComponent from "../../component/community/PostAreaComponent";
import { SubTitle } from "../../component/common/Text";

const CommunityHomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState("안내");
    const [modalContent, setModalContent] = useState("내용");
    const [modalEvent, setModalEvent] = useState(() => {});

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1); // Pagination은 1부터 시작하니까
    const size = 12;

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    let sideSize, centerSize;
    if (isMobile) {
        sideSize = 0;
        centerSize = 12;
    } else if (isTablet) {
        sideSize = 1;
        centerSize = 10;
    } else {
        sideSize = 1.5;
        centerSize = 9;
    }

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

        const load = async () => {
            try {
                const result = await fetchCommunityList(page - 1, size); // 서버는 0-index
                setData(result);
                setLoading(false);
            } catch (e) {
                console.error("동아리 목록 조회 실패:", e);
                setLoading(false);
            }
        };
        load();
    }, [page]);

    return (
        <>
            <ConfirmModal
                open={openConfirm}
                title={modalTitle}
                content={modalContent}
                onConfirm={modalEvent}
                isNoEscape={true}
                isOneBtn={true}
                onClose={() => setOpenConfirm(false)}
            />
            {!data ? (
                <Loading
                    open={loading}
                    text="동아리 목록을 가져오고 있습니다."
                />
            ) : (
                <Box
                    sx={{
                        backgroundColor: "#F8FAFC",
                        width: "100%",
                    }}
                >
                    <CommunityHomeHeader />
                    <BannerLayout useHeader useSide sidePosition="left">
                        <Box
                            sx={{
                                pb: 6,
                                width: "100%", 
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center", 
                            }}
                        >
                            <Grid size={12} sx={{ m: 2, mt: 0, mb: 3 }}>
                                <QuickSearchBar />
                            </Grid>

                            <Grid size={sideSize} />
                            <Grid size={centerSize}>
                                {!data.content || data.content.length === 0 ? (
                                    <SubTitle
                                        sx={{
                                            color: "text.secondary",
                                            textAlign: "center",
                                            mt: 6,
                                        }}
                                        children={
                                            "아직 등록된 동아리 모집 공고가 없습니다!"
                                        }
                                    />
                                ) : (
                                    <PostAreaComponent
                                        posts={data.content}
                                        totalPages={data.totalPages}
                                        page={page}
                                        setPage={setPage}
                                    />
                                )}
                            </Grid>
                            <Grid size={sideSize} />
                        </Box>
                    </BannerLayout>
                </Box>
            )}
        </>
    );
};
export default CommunityHomePage;
