import { Box, Chip, Divider, Stack, Typography, Tooltip } from "@mui/material";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    CalendarCheck,
    UserStar,
} from "lucide-react";
import SectionBox from "../../pages/Course/SectionBox";
import { formattedDate } from "./utility/communityUtility";
import { OneAlignedButton } from "../common/Button";
import { getIdRoleFromToken } from "../../utils/auth";

export default function ClubHeader({
    hasHeader,
    data,
    role,
    eligible,
    emphasizeByline = false,
    onOpenJoin,
}) {
    if (!hasHeader) return <SectionBox label="헤더 정보" />;

    const isFull = data.memberCount >= data.maxMember;
    const isEligible = eligible?.canApply === true;
    const reason = eligible?.reason ?? "";

    const getReason = (reason) => {
        if(reason === "ACTIVE_MEMBER"){
           return "가입된 동아리"
        }else if(reason === "PENDING_ENROLLMENT"){
            return "승인 대기중";
        }
    }

    console.log(
        "role: " + role + ", isEligible: " + isEligible + ", reason: " + reason
    );
    const textStyle = {
        color: "text.secondary",
        fontSize: "1rem",
        lineHeight: 1.5,
    };

    return (
        <SectionBox
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                minHeight: 400,
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexGrow: 1,
                    gap: 2,
                }}
            >
                {/* 상단 제목부 */}
                <Stack spacing={0.5}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.5rem",
                            color: "text.primary",
                            mb: 0.5,
                        }}
                    >
                        {data.name}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* 중앙 메타정보부 */}
                <Stack
                    direction="column"
                    spacing={1.4}
                    sx={{
                        flexGrow: 1,
                        justifyContent: "space-evenly",
                        "& .icon": {
                            width: 20,
                            height: 20,
                            color: "text.secondary",
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <UserStar className="icon" />
                        <Typography sx={textStyle}>
                            <b>운영 기관:</b> {data.founder}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <MapPin className="icon" />
                        <Typography sx={textStyle}>
                            <b>운영 주소:</b>{" "}
                            {data.address + " " + data.addressDetail}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Calendar className="icon" />
                        <Typography sx={textStyle}>
                            <b>일정 형태:</b>{" "}
                            {data.scheduleType === "OCCASIONAL"
                                ? "정기적 모임"
                                : "비정기적 모임"}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Clock className="icon" />
                        <Typography sx={textStyle}>
                            <b>일정 상세:</b> {data.scheduleDetail}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarCheck className="icon" />
                        <Typography sx={textStyle}>
                            <b>등록일:</b> {formattedDate(data.createdAt)}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* 하단 모집 현황부 */}
                <Stack
                    direction="column"
                    spacing={0.5}
                    sx={{
                        flexShrink: 0,
                        "& .icon": {
                            width: 20,
                            height: 20,
                            color: "text.secondary",
                        },
                    }}
                >
                    {/* 제목 */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        모집 현황
                    </Typography>

                    {/* 내용 */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            <Users className="icon" />
                            <Typography sx={textStyle}>
                                {data.memberCount}/{data.maxMember}
                            </Typography>
                            <Chip
                                size="small"
                                label={isFull ? "모집 마감" : "모집 중"}
                                color={isFull ? "default" : "success"}
                                variant={isFull ? "outlined" : "filled"}
                                sx={{
                                    fontWeight: 600,
                                    ml: 0.5,
                                }}
                            />
                        </Stack>

                        {role.role === "INDIVIDUAL" && (
                            <Tooltip
                                title={
                                    isFull
                                        ? "정원이 가득 찼습니다"
                                        : !isEligible
                                        ? getReason(reason)
                                        : ""
                                }
                            >
                                <span>
                                    <OneAlignedButton
                                        variant="contained"
                                        color="primary"
                                        disabled={isFull || !isEligible}
                                        buttonSx={{
                                            py: 1,
                                            borderRadius: "8px",
                                        }}
                                        onClick={onOpenJoin}
                                    >
                                        {isFull
                                            ? "마감됨"
                                            : eligible?.canApply
                                            ? "가입 신청하기"
                                            : "신청 불가"}
                                    </OneAlignedButton>
                                </span>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </SectionBox>
    );
}
