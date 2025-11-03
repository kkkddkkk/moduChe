import { useState } from "react";
import { Box, Typography, Container, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../../component/common/Layout";

import defaultClubImage from "./media/stretch.png";
import CourseImage from "../../pages/Course/CourseImage";
import ClubHeader from "./ClubHeader";
import ClubSidebar from "./ClubSidebar";
import ClubDescription from "./ClubDescription";
import JoinModalComponent from "./JoinModalComponent";
import { OneAlignedButton } from "../common/Button";

const PostDetailComponent = ({ data }) => {
    const navigate = useNavigate();
    const [openJoin, setOpenJoin] = useState(false);

    // ✅ 데이터 방어 처리
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

    const hasImage = !!data?.imageUrl;
    const hasHeader = !!data;
    const hasDetail = !!data?.description;
    const hasSidebar = !!data;

    return (
        <Layout>
            <Toolbar />

            <Container
                maxWidth="xl"
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 3,
                    minHeight: {
                        xs: "calc(100vh - 56px)",
                        sm: "calc(100vh - 64px)",
                    },
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                {/* ======= 메인 Flex 영역 ======= */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        alignItems: "stretch",
                        gap: 3,
                        flex: 1,
                    }}
                >
                    {/* 좌측 콘텐츠 */}
                    <Box
                        sx={{
                            flex: { lg: 3 },
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            minWidth: 0,
                        }}
                    >
                        {/* 상단 이미지 + 헤더 */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 3,
                            }}
                        >
                            <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                                <CourseImage
                                    hasImage={hasImage}
                                    src={data.imageUrl || defaultClubImage}
                                />
                            </Box>

                            <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                                <ClubHeader
                                    hasHeader={hasHeader}
                                    clubData={data}
                                />
                            </Box>
                        </Box>

                        {/* 상세 설명 */}
                        <ClubDescription
                            hasDetail={hasDetail}
                            clubData={data}
                        />

                        {/* 추가 정보 */}
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 600, mb: 1 }}
                            >
                                {data.name || "이름 미등록"}
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {data.description || "소개가 없습니다."}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 3,
                                    color: "text.secondary",
                                }}
                            >
                                <Typography variant="body2">
                                    등록일: {data.createdAt || "-"}
                                </Typography>
                                <Typography variant="body2">
                                    등록자: {data.author || "-"}
                                </Typography>
                                <Typography variant="body2">
                                    회원 수: {data.memberCount || 0}명
                                </Typography>
                            </Box>
                        </Box>

                        {/* 가입 버튼 */}
                        <Box sx={{ mt: 3 }}>
                            <OneAlignedButton
                                variant="contained"
                                align="right"
                                color="primary"
                                children="가입 신청하기"
                                onClick={() => setOpenJoin(true)}
                            />
                        </Box>
                    </Box>

                    {/* 우측 사이드바 */}
                    <Box
                        sx={{
                            flex: { lg: 1 },
                            minWidth: { lg: 320 },
                        }}
                    >
                        <ClubSidebar hasSidebar={hasSidebar} clubData={data} />
                    </Box>
                </Box>

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
