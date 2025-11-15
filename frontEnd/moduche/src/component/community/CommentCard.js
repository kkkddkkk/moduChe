import React from "react";
import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import { Trash2, Flag } from "lucide-react";

export default function CommentCard({
    comment,
    currentUserId,
    onDelete,
    onReport,
}) {
    const isMine = comment.userId === currentUserId;

    return (
        <Box
            key={comment.commentId}
            sx={{
                mb: 2,
                pb: 1.5,
                borderBottom: "1px solid #eee",
                position: "relative",
                pr: 5, // 버튼 자리 확보
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {comment.authorName}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    mb: 0.5,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                }}
            >
                {comment.content}
            </Typography>

            <Stack
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    alignSelf={"center"}
                >
                    {new Date(comment.createdAt).toLocaleString()}
                </Typography>

                {/* === 우측 상단 액션 버튼들 === */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    {/* 내가 쓴 댓글일 때만 삭제 버튼 */}
                    {isMine && (
                        <Tooltip title="삭제하기">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete?.(comment.commentId)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* 신고 버튼 */}
                    <Tooltip title="신고하기">
                        <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onReport?.(comment.commentId)}
                        >
                            <Flag size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        </Box>
    );
}
