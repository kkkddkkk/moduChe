import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Chip,
    useTheme,
} from "@mui/material";
import { formattedDate } from "./utility/communityUtility";
import {
    ArrowRightLeft,
    Ban,
    CircleCheck,
    Crown,
    Plus,
    User,
    UserStar,
} from "lucide-react";

const MemberCard = ({
    member,
    onRole, // 등급 수정
    onSuspend, // 계정 정지
    onActivate, // 정지 해제
    onDetail, // 더보기
}) => {
    const theme = useTheme();
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
                            {member.name}
                        </Typography>
                        <Chip
                            size="small"
                            icon={
                                member.role === "ADMIN" ? (
                                    <Crown size={16} />
                                ) : (
                                    <User size={16} />
                                )
                            }
                            label={
                                member.role === "MEMBER"
                                    ? "일반 회원"
                                    : member.role === "MANAGER"
                                    ? "매니저"
                                    : "운영자"
                            }
                            sx={{
                                py: 0,
                                px: 1,
                                border: "2px solid",
                                borderColor:
                                    member.role === "ADMIN"
                                        ? theme.palette.primary.main
                                        : "grey.600",
                                color: "success.main",
                                "& .MuiChip-icon": {
                                    color:
                                        member.role === "ADMIN"
                                            ? theme.palette.primary.main
                                            : "grey.600",
                                },
                                "& .MuiChip-label": {
                                    color:
                                        member.role === "ADMIN"
                                            ? theme.palette.primary.main
                                            : "grey.600",
                                },
                                bgcolor: "transparent",
                            }}
                        />
                    </Stack>

                    {/* Chip 버튼 그룹 */}
                    <Stack direction="row" spacing={1}>
                        {/*더보기*/}
                        <Chip
                            label="더보기"
                            size="small"
                            icon={<Plus size={16} />}
                            onClick={() => onDetail(member)}
                            sx={{
                                px: 1,
                                bgcolor: "grey.100",
                                "& .MuiChip-label": { px: 0.5 },
                                "&:hover": { bgcolor: "grey.200" },
                                cursor: "pointer",
                            }}
                        />

                        {/*정지 상태 → 정지 해제*/}
                        {member.status === "SUSPENDED" && (
                            <Chip
                                label="복구"
                                size="small"
                                color="success"
                                icon={<CircleCheck size={16} />}
                                onClick={() => onActivate(member)}
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
                                        "& .MuiChip-icon": { color: "white" },
                                    },
                                    cursor: "pointer",
                                }}
                            />
                        )}

                        {/*활성 → 계정 정지*/}
                        {member.status === "ACTIVE" &&
                            member.role !== "ADMIN" && (
                                <Chip
                                    label="정지"
                                    size="small"
                                    color="warning"
                                    icon={<Ban size={16} />}
                                    onClick={() => onSuspend(member)}
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
                            )}

                        {/*등급 수정 (활성만)*/}
                        {member.status === "ACTIVE" &&
                            member.role !== "ADMIN" && (
                                <Chip
                                    label="등급"
                                    size="small"
                                    icon={<UserStar size={16} />}
                                    onClick={() => onRole(member)}
                                    sx={{
                                        px: 1,
                                        border: "2px solid",
                                        borderColor: "grey.600",
                                        color: "grey.600",
                                        "& .MuiChip-icon": {
                                            color: "grey.600",
                                        },
                                        bgcolor: "transparent",
                                        "&:hover": {
                                            bgcolor: "grey.600",
                                            color: "white",
                                            "& .MuiChip-icon": {
                                                color: "white",
                                            },
                                        },
                                        cursor: "pointer",
                                    }}
                                />
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
                        가입일: {formattedDate(member.joinedAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        상태:{" "}
                        {member.status === "ACTIVE"
                            ? "활동 중"
                            : member.status === "QUIT"
                            ? "탈퇴"
                            : "계정 정지"}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default MemberCard;
