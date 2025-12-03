import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import Loading from "../../component/common/Loading";
import ConfirmModal from "../../component/community/ConfirmModal";
import { useEffect, useState } from "react";
import { fetchCommunityList } from "../../api/communityAPI/communityAPI";
import { isLoggedIn, isTokenExpired } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import BannerLayout from "../../component/common/BannerLayout";
import CommunityHomeHeader from "../../component/community/CommunityHomeHeader";
import QuickSearchBar from "../../component/common/QuickSearchBar";
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
    const [page, setPage] = useState(1); // Pagination은 1부터 시작
    const size = 12;

    // 🔍 퀵 검색 결과용 상태
    const [searchItems, setSearchItems] = useState(null);
    const [searchTotal, setSearchTotal] = useState(0);
    const [lastSearchPayload, setLastSearchPayload] = useState(null);

    // 반응형 레이아웃 (november4 기준)
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

    // ✅ 로그인/토큰 검사 + 커뮤니티 목록 로드
    useEffect(() => {
        // 로그인 체크
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

        // 토큰 만료 체크
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

        // 리스트 로딩 (검색 중이 아닐 때만)
        const load = async () => {
            try {
                const result = await fetchCommunityList(page - 1, size);
                setData(result);
                setLoading(false);
            } catch (e) {
                console.error("동아리 목록 조회 실패:", e);
                setLoading(false);
            }
        };

        if (!searchItems) {
            load();
        }
    }, [page, navigate, searchItems]);

    // ✅ QuickSearchBar에서 결과 받기
    const handleQuickSearchResult = (items, total, payload) => {
        const normalized = (items || []).map((item) => ({
            // key / URL 용
            postId: item.communityId,
            // 카드에 보여줄 텍스트
            name: item.title,
            desc: item.summary,
            // 썸네일
            representativeImage: item.representativeImage,
            createdAt: item.createdAt,
            // 검색 응답에는 없으니 기본값 0
            memberCount: item.memberCount ?? 0,
            // 검색 결과는 일단 일반 목록으로 취급
            sponsored: false,
            // React key용 fallback
            communityId: item.communityId,
        }));

        setSearchItems(normalized);
        setSearchTotal(total || 0);
        setLastSearchPayload(payload);
        setPage(1);
    };

    const isSearchMode = !!searchItems;

    const posts = isSearchMode ? searchItems : data?.content || [];
    const totalPages = isSearchMode
        ? Math.max(1, Math.ceil(searchTotal / size))
        : data?.totalPages || 1;

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

            {!data && !isSearchMode ? (
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
                            {/* 🔍 상단 퀵 검색바 */}
                            <Grid sx={{ m: 2, mt: 0, mb: 3 }} container>
                                <Grid item xs={12}>
                                    <QuickSearchBar
                                        boardType="COMMUNITY"
                                        onResult={handleQuickSearchResult}
                                        initialPayload={lastSearchPayload}
                                    />
                                </Grid>
                            </Grid>

                            {/* 본문 영역 (양옆 여백 + 중앙 컨텐츠) */}
                            <Grid container spacing={2} sx={{ width: "100%" }}>
                                <Grid item size={sideSize} />
                                <Grid item size={centerSize}>
                                    {posts.length === 0 ? (
                                        <SubTitle
                                            sx={{
                                                color: "text.secondary",
                                                textAlign: "center",
                                                mt: 6,
                                            }}
                                        >
                                            아직 등록된 동아리 모집 공고가
                                            없습니다!
                                        </SubTitle>
                                    ) : (
                                        <PostAreaComponent
                                            posts={posts}
                                            totalPages={totalPages}
                                            page={page}
                                            setPage={setPage}
                                        />
                                    )}
                                </Grid>
                                <Grid item size={sideSize} />
                            </Grid>
                        </Box>
                    </BannerLayout>
                </Box>
            )}
        </>
    );
};

export default CommunityHomePage;
