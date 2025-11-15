import React, { useEffect, useRef } from "react";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import Paper from "../common/Paper";
import CommentCard from "./CommentCard";

const CommentSection = ({
    comments = [],
    onLoadMore,
    hasMore,
    loading,
    currentUserId,
    onSubmit,
    onChange,
    onDeleteComment,
    onReportComment,
    inputValue = "",
}) => {
    const scrollRef = useRef(null);

    // 새 댓글 추가 시 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    return (
        <Paper
            elevation={1}
            sx={{
                m: 0,
                flex: { lg: 1 },
                minWidth: { lg: 320 },
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fafafa",
                height: { xs: "auto", lg: "70vh" },
            }}
        >
            {/* 헤더 */}
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                댓글 {comments?.length ?? 0}개
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* 스크롤 가능한 댓글 목록 */}
            <Box
                ref={scrollRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ccc",
                        borderRadius: 3,
                    },
                }}
            >
                {comments.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 2 }}
                    >
                        아직 댓글이 없습니다.
                    </Typography>
                ) : (
                    comments.map((c) => (
                        <CommentCard
                            key={c.commentId}
                            comment={c}
                            currentUserId={currentUserId}
                            onDelete={onDeleteComment}
                            onReport={onReportComment}
                        />
                    ))
                )}
            </Box>

            {/* 더보기 버튼 */}
            {hasMore && (
                <Button
                    onClick={onLoadMore}
                    disabled={loading}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    {loading ? "불러오는 중..." : "댓글 더보기"}
                </Button>
            )}

            {/* 입력창 */}
            <Divider sx={{ my: 2 }} />
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit?.();
                }}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                }}
            >
                <TextField
                    placeholder="댓글을 입력하세요"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={inputValue}
                    onChange={(e) => onChange?.(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!inputValue.trim()}
                    sx={{ flexShrink: 0 }}
                >
                    등록
                </Button>
            </Box>
        </Paper>
    );
};

export default CommentSection;
