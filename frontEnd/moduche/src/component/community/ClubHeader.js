import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import SectionBox from "../../pages/Course/SectionBox";
import { StandardSelect } from "../common/CustomSelect";
import { formattedDate } from "./utility/communityUtility";

export default function ClubHeader({
    hasHeader,
    data,
    showMeta = true,
    emphasizeByline = false,
}) {
    if (!hasHeader) return <SectionBox label="헤더 정보" />;

    if (!hasHeader) {
        return <SectionBox label="헤더 정보" />;
    }

    console.log(data);
    return (
        <SectionBox>
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    height: "100%",
                }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight="bold">
                        {data.name}
                    </Typography>

                    {/* byline 크기/가중치 제어 */}
                    <Typography
                        variant={emphasizeByline ? "body1" : "body2"}
                        color="text.secondary"
                        sx={{ fontWeight: emphasizeByline ? 600 : 400 }}
                    >
                        <b>
                            운영자: {data.founder} · 위치: {data.address}
                        </b>
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        pt={1}
                        alignItems="flex-start"
                    >
                        {/* 날짜 */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "24px 1fr",
                                rowGap: 0.5,
                                columnGap: 1,
                                alignItems: "center",
                                "& .icon": {
                                    width: 20,
                                    height: 20,
                                    display: "block",
                                    fill: "none",
                                    stroke: "currentColor",
                                    flexShrink: 0,
                                },
                            }}
                        >
                            <Calendar className="icon" />
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{ fontSize: "1.4rem", lineHeight: 1.45 }}
                            >
                                일정 형태:{" "}
                                {data.scheduleType === "OCCASIONAL"
                                    ? "정기적 모임"
                                    : "비정기적 모임"}
                            </Typography>

                            <Clock className="icon" />
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{ fontSize: "1.4rem", lineHeight: 1.45 }}
                            >
                                일정 상세: {data.scheduleDetail}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
                <Divider />
                <Grid container>
                    <Grid item>
                        <Typography component="span" color="text.secondary">
                            운영자: {data.founder}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography component="span" color="text.secondary">
                            등록일: {formattedDate(data.createdAt)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography component="span" color="text.secondary">
                            모집 인원: {data.memberCount + "/" + data.maxMember}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </SectionBox>
    );
}
