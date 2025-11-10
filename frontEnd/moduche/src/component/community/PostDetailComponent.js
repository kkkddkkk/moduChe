import { useState } from "react";
import {
    Box,
    Typography,
    Container,
    Toolbar,
    Paper,
    Divider,
    Button,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../../component/common/Layout";
import defaultClubImage from "./media/stretch.png";
import ClubHeader from "./ClubHeader";
import ClubSidebar from "./ClubSidebar";
import ClubDescription from "./ClubDescription";
import JoinModalComponent from "./JoinModalComponent";
import { OneAlignedButton } from "../common/Button";
import CommunityImage from "./CommunityImage";
import SectionBox from "../../pages/Course/SectionBox";

const PostDetailComponent = ({
    data,
    comments = [],
    onLoadMoreComments,
    hasMore,
    loading,
}) => {
    const navigate = useNavigate();
    const [openJoin, setOpenJoin] = useState(false);

    if (!data) {
        return (
            <Layout>
                <Container sx={{ py: 10, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                        데이터를 불러오는 중입니다...
                    </Typography>
                </Container>
            </Layout>
        );
    }

    const hasImages =
        Array.isArray(data?.postImages) && data.postImages.length > 0;

    const hashtags = data.hashTags
        ? data.hashTags.split(/\s+/).filter(Boolean)
        : [];

    const fullAddress = data.address + " " + data.addressDetail;

    return (
        <Layout>
            <Container
                maxWidth="xl"
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 3,
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 3,
                }}
            >
                {/* ===== 좌측 메인 ===== */}
                <Box
                    sx={{
                        flex: { lg: 3 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    {/* === 상단 === */}
                    <Box
                        sx={{
                            flex: { lg: 3 },
                            display: "flex",
                            flexDirection: { xs: "column", lg: "row" }, 
                            alignItems: "stretch", 
                            gap: 3,
                        }}
                    >
                        {/* 이미지 폭을 더 넓게 (예: 60%) */}
                        <Box
                            sx={{
                                flex: { lg: 2, xs: "none" },
                                width: { xs: "100%", lg: "auto" }, // ✅ 모바일에선 꽉 채우기
                                maxWidth: { xs: "100%", lg: "500px" }, // ✅ 데스크톱 제한
                            }}
                        >
                            <CommunityImage
                                images={
                                    hasImages
                                        ? data.postImages
                                        : [defaultClubImage]
                                }
                            />
                        </Box>

                        {/* 헤더 폭을 줄이기 (예: 40%) */}
                        <Box sx={{ flex: 3 }}>
                            <ClubHeader hasHeader={true} data={data} />
                        </Box>
                    </Box>

                    <ClubDescription
                        hasDetail={!!data.content}
                        title={data.title}
                        content={data.content}
                        tags={hashtags}
                        address={fullAddress}
                    />

                    {/* 가입 버튼 */}
                    <OneAlignedButton
                        variant="contained"
                        align="right"
                        color="primary"
                        children="가입 신청하기"
                        onClick={() => setOpenJoin(true)}
                    />
                </Box>

                {/* ===== 우측 댓글 사이드 ===== */}
                <Paper
                    elevation={1}
                    sx={{
                        flex: { lg: 1 },
                        minWidth: { lg: 320 },
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        backgroundColor: "#fafafa",
                        height: "fit-content",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        댓글 {comments?.length ?? 0}개
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {comments.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            아직 댓글이 없음.
                        </Typography>
                    ) : (
                        comments.map((c) => (
                            <Box
                                key={c.commentId}
                                sx={{
                                    mb: 2,
                                    pb: 1,
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                <Typography variant="subtitle2">
                                    {c.authorName}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    {c.content}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {new Date(c.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        ))
                    )}

                    {hasMore && (
                        <Button
                            onClick={onLoadMoreComments}
                            disabled={loading}
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {loading ? "불러오는 중..." : "댓글 더보기"}
                        </Button>
                    )}
                </Paper>

                {/* 가입 모달 */}
                <JoinModalComponent
                    open={openJoin}
                    onClose={() => setOpenJoin(false)}
                    clubName={data.name}
                />
            </Container>
        </Layout>
    );
};

export default PostDetailComponent;
