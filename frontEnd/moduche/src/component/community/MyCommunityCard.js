import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import { Plus, Check, X } from "lucide-react";
import {
    formattedDate,
    sliceContent,
} from "../../component/community/utility/communityUtility";

const MyCommunityCard = ({ data, onDetail, onQuit }) => {
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
            <CardContent sx={{ p: 0, pb: 0 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        {data.name}
                    </Typography>

                    {/* 버튼 그룹 */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        {/* 더보기 */}
                        <Chip
                            label="더보기"
                            size="small"
                            icon={<Plus size={16} />}
                            onClick={() => onDetail(data)}
                            sx={{
                                px: 1,
                                bgcolor: "grey.100",
                                "& .MuiChip-label": { px: 0.5 },
                                "&:hover": { bgcolor: "grey.200" },
                                cursor: "pointer",
                            }}
                        />

                        {/* 탈퇴 */}
                        {!data.status == "QUIt" && (
                            <Chip
                                label="탈퇴"
                                size="small"
                                icon={<X size={16} />}
                                onClick={() => onQuit(data)}
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
                                        "& .MuiChip-icon": { color: "white" },
                                    },
                                    cursor: "pointer",
                                }}
                            />
                        )}
                    </Stack>
                </Stack>

                {/* 가입일 (두 번째 줄) */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {formattedDate(data.joinedAt)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MyCommunityCard;
