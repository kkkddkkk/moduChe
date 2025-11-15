import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Chip,
} from "@mui/material";
import { formattedDate } from "./utility/communityUtility";
import { ArrowRightLeft, Ban, CircleCheck, Pencil, Plus, UserStar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostManageCard = ({
    post,
    onDelete, // 게시물 삭제 하기
    onEdit, //게시물 수정 하기
}) => {
    const navigate = useNavigate();
    return (
        <Card
            variant="outlined"
            sx={{
                position: "relative",
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.background.default,
                p: 2,
                pb: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderLeft: (theme) =>
                    `5px solid ${theme.palette.primary.main}`,
            }}
        >
            {/* 상단: 이름 + 역할 */}
            <CardContent sx={{ p: 0 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                            {post.title}
                        </Typography>
                    </Stack>

                    {/* Chip 버튼 그룹 */}
                    <Stack direction="row" spacing={1}>
                        {/* 게시 상태 게시물 => 게시물 수정, 이동, 삭제하기 기능 */}
                        {post.status === "PUBLISHED" || post.status === "REGISTERED"&& (
                            <>
                                <Chip
                                    label="게시물"
                                    size="small"
                                    icon={<Plus size={16} />}
                                    onClick={() => navigate(`/community/details/${post.postId}`)}
                                    sx={{
                                        px: 1,
                                        bgcolor: "grey.100",
                                        "& .MuiChip-label": { px: 0.5 },
                                        "&:hover": { bgcolor: "grey.200" },
                                        cursor: "pointer",
                                    }}
                                />
                                <Chip
                                    label="수정"
                                    size="small"
                                    color="success"
                                    icon={<Pencil size={16} />}
                                    onClick={() => {onEdit(post)}}
                                    sx={{
                                        px: 1,
                                        border: "2px solid",
                                        borderColor: "success.main",
                                        color: "success.main",
                                        "& .MuiChip-icon": {
                                            color: "success.main",
                                        },
                                        bgcolor: "transparent",
                                        "&:hover": {
                                            bgcolor: "success.main",
                                            color: "white",
                                            "& .MuiChip-icon": {
                                                color: "white",
                                            },
                                        },
                                        cursor: "pointer",
                                    }}
                                />
                                <Chip
                                    label="삭제"
                                    size="small"
                                    color="warning"
                                    icon={<Ban size={16} />}
                                    onClick={() => onDelete(post)}
                                    sx={{
                                        px: 1,
                                        border: "2px solid",
                                        borderColor: "error.main",
                                        color: "error.main",
                                        "& .MuiChip-icon": {
                                            color: "error.main",
                                        },
                                        bgcolor: "transparent",
                                        "&:hover": {
                                            bgcolor: "error.main",
                                            color: "white",
                                            "& .MuiChip-icon": {
                                                color: "white",
                                            },
                                        },
                                        cursor: "pointer",
                                    }}
                                />
                            </>
                        )}
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                >
                    <Typography variant="body2" color="text.secondary">
                        작성일: {formattedDate(post.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        상태:{" "}
                        {post.status === "PUBLISHED" || post.status === "REGISTERED"? "게시중" : "삭제됨"}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PostManageCard;
