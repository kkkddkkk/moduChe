import { Box, Typography, Container, Divider } from "@mui/material";
import Layout from "../../component/common/Layout";
import defaultClubImage from "./media/stretch.png";
import ClubHeader from "./ClubHeader";
import ClubDescription from "./ClubDescription";
import JoinModalComponent from "./JoinModalComponent";
import CommunityImage from "./CommunityImage";
import CommentSection from "./CommentSection";
import { useState } from "react";

export default function PostDetailComponent({
    data,
    comments,
    hasMore,
    loading,
    inputValue,
    onChange,
    onSubmit,
    currentUserId,
    onDeleteComment,
    onReportComment,
    onLoadMore,
    submitting,
    role,
    eligible
}) {

    const hasImages =
        Array.isArray(data?.postImages) && data.postImages.length > 0;

    const hashtags = data.hashTags
        ? data.hashTags.split(/\s+/).filter(Boolean)
        : [];

    const fullAddress = data.address + " " + data.addressDetail;
    const [joinModal, setJoinModal] = useState();

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
                {/* === 좌측 본문 === */}
                <Box
                    sx={{
                        flex: { lg: 3 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", lg: "row" },
                            gap: 3,
                        }}
                    >
                        <Box
                            sx={{
                                flex: { lg: 2 },
                                width: { xs: "100%", lg: "auto" },
                                maxWidth: { xs: "100%", lg: "500px" },
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
                        <Box sx={{ flex: { lg: 3 } }}>
                            <ClubHeader
                                hasHeader
                                data={data}
                                role={role}
                                eligible={eligible}
                                onOpenJoin={() => setJoinModal(true)}
                            />
                        </Box>
                    </Box>

                    <ClubDescription
                        hasDetail={!!data.content}
                        title={data.title}
                        content={data.content}
                        tags={hashtags}
                        address={fullAddress}
                    />
                </Box>

                {/* === 우측 댓글 섹션 === */}
                <Box
                    sx={{
                        flex: { lg: 1 },
                        minWidth: { lg: 320 },
                        position: { lg: "sticky" },
                        top: { lg: "88px" },
                        alignSelf: "flex-start",
                    }}
                >
                    <CommentSection
                        comments={comments}
                        hasMore={hasMore}
                        loading={loading}
                        onLoadMore={onLoadMore}
                        inputValue={inputValue}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        currentUserId={currentUserId}
                        onDeleteComment={onDeleteComment}
                        onReportComment={onReportComment}
                        submitting={submitting}
                    />
                </Box>
            </Container>

            <JoinModalComponent
                clubName={data.name}
                onClose={() => setJoinModal(false)}
                communityId={data.communityId}
                open={joinModal}
            />
        </Layout>
    );
}
