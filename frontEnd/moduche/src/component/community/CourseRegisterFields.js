import {
    Typography,
    TextField,
    MenuItem,
    useTheme,
    useMediaQuery,
    Grid,
    alpha,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Box,
} from "@mui/material";
import { CalendarCheck, ClipboardList, Receipt, Tag } from "lucide-react";
import { SubTitle } from "../common/Text";
import { RegisterTitle } from "./RegisterTitle";
import CustomTextField from "../common/CustomTextField";
import { OneAlignedButton } from "../common/Button";
import { HashTagInput } from "../common/HashTagInput";
import Paper from "../common/Paper";
import { useState } from "react";

export const CourseRegisterFields = ({ form, setForm, onChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    // 접근성 옵션
    const [accessibility, setAccessibility] = useState({
        visual: false,
        hearing: false,
        mobility: false,
        assistant: false,
        signLanguage: false,
    });

    const handleAccessibilityChange = (key) => {
        const updated = { ...accessibility, [key]: !accessibility[key] };
        setAccessibility(updated);
        setForm((prev) => ({ ...prev, accessibility: updated }));
    };

    return (
        <>
            {/* 기본 정보 */}
            <Grid size={isMobile || isTablet ? 12 : 6} sx={{ mb: 2 }}>
                <SubTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 2,
                    }}
                >
                    <ClipboardList color={theme.palette.primary.main} />
                    기본 정보
                </SubTitle>

                <Paper
                    sx={{
                        p: 3,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.3
                        )}`,
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: 4,
                            height: "100%",
                            borderRadius: `100px 0 0 100px`,
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                >
                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"강좌명"} />
                        <CustomTextField
                            data={form.name || ""}
                            setData={(value) =>
                                setForm((prev) => ({ ...prev, name: value }))
                            }
                            placeholder="예: Adaptive Pilates — Core Strength for All"
                            padding={10}
                        />
                    </Grid>

                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"강사명"} />
                        <CustomTextField
                            data={form.instructor || ""}
                            setData={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    instructor: value,
                                }))
                            }
                            placeholder="예: Jamie Park"
                            padding={10}
                        />
                    </Grid>

                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"시설명"} />
                        <CustomTextField
                            data={form.facility || ""}
                            setData={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    facility: value,
                                }))
                            }
                            placeholder="예: Navi Athletics Club"
                            padding={10}
                        />
                    </Grid>

                    <Grid size={12}>
                        <RegisterTitle title={"최대 참가 인원"} />
                        <TextField
                            name="maxParticipants"
                            type="number"
                            fullWidth
                            placeholder="예: 10"
                            value={form.maxParticipants || ""}
                            onChange={onChange}
                        />
                    </Grid>
                </Paper>
            </Grid>

            {/* 운영 일정 */}
            <Grid size={isMobile || isTablet ? 12 : 6}>
                <SubTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 2,
                    }}
                >
                    <CalendarCheck color={theme.palette.primary.main} />
                    운영 일정
                </SubTitle>

                <Paper
                    sx={{
                        p: 3,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.3
                        )}`,
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: 4,
                            height: "100%",
                            borderRadius: `100px 0 0 100px`,
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                >
                    {/* 위치 */}
                    <Grid container size={12} sx={{ mb: 4.5 }}>
                        <RegisterTitle title={"활동 위치"} />
                        <Grid item size={8}>
                            <CustomTextField
                                data={form.address || ""}
                                setData={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: value,
                                    }))
                                }
                                placeholder="기본 주소"
                                padding={10}
                            />
                        </Grid>
                        <Grid item size={4} mb={1}>
                            <OneAlignedButton
                                sx={{ height: "100%", width: "100%" }}
                                buttonWrapperSx={{ width: "90%" }}
                            >
                                검색
                            </OneAlignedButton>
                        </Grid>
                        <CustomTextField
                            data={form.addressDetail || ""}
                            setData={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    addressDetail: value,
                                }))
                            }
                            placeholder="상세 주소"
                            padding={10}
                        />
                    </Grid>

                    {/* 기간 */}
                    <Grid container sx={{ mb: 4.5 }}>
                        <Grid item size={6}>
                            <RegisterTitle title={"시작일"} />
                            <TextField
                                type="date"
                                name="startDate"
                                value={form.startDate || ""}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <RegisterTitle title={"종료일"} />
                            <TextField
                                type="date"
                                name="endDate"
                                value={form.endDate || ""}
                                onChange={onChange}
                            />
                        </Grid>
                    </Grid>

                    {/* 주기 */}
                    <Grid item size={12} sx={{ mb: 2.4 }}>
                        <RegisterTitle title={"운영 주기"} />
                        <CustomTextField
                            data={form.scheduleInfo || ""}
                            setData={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    scheduleInfo: value,
                                }))
                            }
                            placeholder="예: Weekly • Tue/Thu • 8 Sessions / 4 Weeks"
                            padding={10}
                        />
                    </Grid>
                </Paper>
            </Grid>

            {/* 세션 및 금액 */}
            <Grid size={12} sx={{ mt: 2 }}>
                <SubTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 2,
                    }}
                >
                    <Receipt color={theme.palette.primary.main} />
                    수강료 및 세션
                </SubTitle>

                <Paper
                    sx={{
                        p: 3,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.3
                        )}`,
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: 4,
                            height: "100%",
                            borderRadius: `100px 0 0 100px`,
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                >
                    <Grid container size={12}>
                        <Grid item size={5.5}>
                            <RegisterTitle title={"수강료"} sx={{ mt: 3 }} />
                            <TextField
                                name="price"
                                type="number"
                                fullWidth
                                placeholder="예: 120000"
                                value={form.price || ""}
                                onChange={onChange}
                                sx={{ mb: 3 }}
                            />

                            <RegisterTitle title={"환불 정책"} />
                            <CustomTextField
                                data={form.refundPolicy || ""}
                                setData={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        refundPolicy: value,
                                    }))
                                }
                                placeholder="예: 첫 수업 24시간 전 100% 환불"
                            />
                        </Grid>
                        <Grid item size={1} />
                        {/* 세션 블록 */}
                        <Grid item size={5.5}>
                            <RegisterTitle title={"세션 구성"} />
                            <CustomTextField
                                data={form.sessionInfo || ""}
                                setData={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        sessionInfo: value,
                                    }))
                                }
                                placeholder="예: Block A (Nov 1–30) / Session 1: Nov 07 19:00"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </>
    );
};
