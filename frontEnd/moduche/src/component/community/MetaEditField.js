import {
    Typography,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Grid,
    Box,
    Button,
    useTheme,
    useMediaQuery,
    alpha,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SubTitle } from "../common/Text";
import Paper from "../common/Paper";
import CustomTextField from "../common/CustomTextField";
import { RegisterTitle } from "./RegisterTitle";
import { OneAlignedButton } from "../common/Button";
import { CalendarCheck, ClipboardList } from "lucide-react";
import { PreviewRounded } from "@mui/icons-material";
import { useUser } from "../../context/UserContext";

const MetaEditField = ({ meta, setMeta, onChange, setOpen, onSubmit }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const [scheduleType, setScheduleType] = useState("비정기");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedWeeks, setSelectedWeeks] = useState([]);
    const [customDate, setCustomDate] = useState("");


    const name = localStorage.getItem("name");

    useEffect(() => {
        if (meta) {
            setScheduleType(meta.scheduleType ?? "PERIODICAL");
            setSelectedDays(meta.selectedDays ?? []);
            setSelectedWeeks(meta.selectedWeeks ?? []);
            setCustomDate(meta.customDate ?? "");
        }
    }, []);

    useEffect(() => {
        setMeta((prev) => {
            // 같은 값이면 그대로 유지.
            if (prev.scheduleType === scheduleType) return prev;

            const updated = { ...prev, scheduleType };

            if (scheduleType === "PERIODICAL") {
                // 정기일 때 customDate 초기화.
                updated.customDate = "";
            } else {
                // 비정기일 때 selectedDays/Weeks 초기화.
                updated.selectedDays = [];
                updated.selectedWeeks = [];
            }

            return updated;
        });
    }, [scheduleType, setMeta]);

    useEffect(() => {
        //우편번호 스크립트.
        if (!window.daum?.Postcode) {
            const postcodeScript = document.createElement("script");
            postcodeScript.src =
                "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            postcodeScript.defer = true;
            document.body.appendChild(postcodeScript);
        }
    }, []);

    const handleWeekToggle = (week) => {
        const next = selectedWeeks.includes(week)
            ? selectedWeeks.filter((w) => w !== week)
            : [...selectedWeeks, week];
        setSelectedWeeks(next);
        setMeta((prev) => ({ ...prev, selectedWeeks: next }));
    };

    const handleDayToggle = (day) => {
        const next = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];
        setSelectedDays(next);
        setMeta((prev) => ({ ...prev, selectedDays: next }));
    };

    const handleCustomDateChange = (value) => {
        setCustomDate(value);
        setMeta((prev) => ({ ...prev, customDate: value }));
    };

    const handleSearchLoca = () => {
        if (!window.daum?.Postcode) {
            alert("주소 검색 모듈 로딩 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: async (data) => {
                const mainAddress =
                    data.userSelectedType === "R"
                        ? data.roadAddress
                        : data.jibunAddress;

                //좌표 조회.
                const coords = await getCoords(mainAddress);

                // meta 위치 관련 정보 업데이트.
                setMeta((prev) => ({
                    ...prev,
                    address: mainAddress,
                    geoLat: coords?.lat ?? null,
                    geoLng: coords?.lng ?? null,
                }));
            },
        }).open();
    };

    //위경도 반환용 유틸 함수.
    const getCoords = async (address) => {
        try {
            const res = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
                    address
                )}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Kakao 주소 좌표 변환 실패");
            const data = await res.json();

            if (!data.documents?.length) {
                console.warn("좌표 정보 없음:", address);
                return null;
            }

            const { x, y } = data.documents[0];
            return { lat: y, lng: x };
        } catch (err) {
            console.error("getCoords() 오류:", err);
            return null;
        }
    };

    const convertToDto = (meta) => {
        let scheduleDetail = "";

        if (meta.scheduleType === "PERIODICAL") {
            scheduleDetail = `${meta.selectedWeeks.join(
                " "
            )} ${meta.selectedDays.join(",")}`;
        } else {
            scheduleDetail = meta.customDate;
        }

        return {
            name: meta.name,
            purpose: meta.purpose,
            maxMember: meta.maxMember,
            scheduleType: meta.scheduleType,
            scheduleDetail,
            address: meta.address,
            addressDetail: meta.addressDetail,
            geoLat: meta.geoLat ?? null,
            geoLng: meta.geoLng ?? null,
        };
    };

    return (
        <Grid container size={12}>
            <Grid item size={isMobile || isTablet ? 12 : 6}>
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
                    {/* 설립자 이름 */}
                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"설립자 이름"} />
                        <CustomTextField
                            data={name || "미확인"}
                            setData={() => {}}
                            disabled={true}
                            padding={10}
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "#555", // 시각적으로 회색 톤
                                    cursor: "not-allowed",
                                },
                            }}
                        />
                    </Grid>
                    {/* 동아리 이름 */}
                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"동아리 이름"} />
                        <CustomTextField
                            data={meta.name || ""}
                            setData={(value) =>
                                setMeta((prev) => ({ ...prev, name: value }))
                            }
                            placeholder="설립될 동아리의 이름을 입력해주세요"
                            padding={10}
                        />
                    </Grid>

                    {/* 동아리 설립 취지 */}
                    <Grid size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"설립 목적 및 취지"} />
                        <CustomTextField
                            data={meta.purpose || ""}
                            setData={(value) =>
                                setMeta((prev) => ({ ...prev, purpose: value }))
                            }
                            placeholder="동아리 설립의 목적 및 취지를 입력해주세요"
                            padding={10}
                        />
                    </Grid>

                    {/* 최대 모집 인원 */}
                    <Grid size={12} sx={{ mb: 0 }}>
                        <RegisterTitle title={"최대 모집 인원"} />
                        <TextField
                            name="maxMember"
                            type="number"
                            fullWidth
                            required
                            sx={{ mb: 0, padding: 0 }}
                            placeholder="1"
                            value={meta.maxMember || ""}
                            onChange={(e) =>
                                setMeta((prev) => ({
                                    ...prev,
                                    maxMember: Number(e.target.value),
                                }))
                            }
                        />
                    </Grid>
                </Paper>
            </Grid>

            <Grid
                item
                size={isMobile || isTablet ? 12 : 6}
                sx={{ pt: isMobile || isTablet ? 2 : 0 }}
            >
                <SubTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 2,
                    }}
                >
                    <CalendarCheck color={theme.palette.primary.main} />
                    활동 정보
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
                    {/* 활동 위치 */}
                    <Grid container size={12} sx={{ mb: 3 }}>
                        <RegisterTitle title={"활동 위치"} />
                        <Grid item size={8}>
                            <CustomTextField
                                data={meta.address || ""}
                                setData={(value) =>
                                    setMeta((prev) => ({
                                        ...prev,
                                        address: value,
                                    }))
                                }
                                placeholder="기본 주소를 검색해주세요"
                                padding={10}
                            />
                        </Grid>
                        <Grid item size={4} mb={1}>
                            <OneAlignedButton
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "5px",
                                }}
                                buttonWrapperSx={{ width: "90%" }}
                                onClick={handleSearchLoca}
                            >
                                검색
                            </OneAlignedButton>
                        </Grid>
                        <CustomTextField
                            data={meta.addressDetail || ""}
                            setData={(value) =>
                                setMeta((prev) => ({
                                    ...prev,
                                    addressDetail: value,
                                }))
                            }
                            placeholder="상세 주소를 입력해주세요"
                            padding={10}
                        />
                    </Grid>

                    {/* 활동 주기 */}
                    <Grid container size={12} sx={{ mb: 0 }}>
                        <RegisterTitle title={"활동 주기"} />
                        {/* 정기 혹은 비정기 선택 */}
                        <Grid size={12}>
                            <FormControl sx={{ mb: 1 }}>
                                <RadioGroup
                                    row
                                    value={scheduleType}
                                    onChange={(e) =>
                                        setScheduleType(e.target.value)
                                    }
                                >
                                    <FormControlLabel
                                        value="PERIODICAL"
                                        control={<Radio />}
                                        label="정기"
                                    />
                                    <FormControlLabel
                                        value="OCCASIONAL"
                                        control={<Radio />}
                                        label="비정기"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {/* 매주, 격주, 매월 선택 */}
                        <Grid size={12} mb={2}>
                            {scheduleType === "PERIODICAL" ? (
                                <>
                                    {/* 주기 선택 */}
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 0.7,
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        주기 선택
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {["매주", "격주", "매월"].map((w) => (
                                            <Button
                                                size="small"
                                                sx={{
                                                    px: 1,
                                                    py: 0.3,
                                                    minWidth: "auto",
                                                    fontSize: "0.85rem",
                                                }}
                                                key={w}
                                                variant={
                                                    selectedWeeks.includes(w)
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                onClick={() =>
                                                    handleWeekToggle(w)
                                                }
                                            >
                                                {w}
                                            </Button>
                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <></>
                            )}
                        </Grid>
                        <Grid size={12}>
                            {scheduleType === "PERIODICAL" ? (
                                <>
                                    {/* 요일 선택 */}
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 0.75,
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        요일 선택
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            flexWrap: "wrap",
                                            mb: 0,
                                        }}
                                    >
                                        {[
                                            "월",
                                            "화",
                                            "수",
                                            "목",
                                            "금",
                                            "토",
                                            "일",
                                        ].map((d) => (
                                            <Button
                                                sx={{
                                                    px: 1.2,
                                                    py: 0.3,
                                                    minWidth: "auto",
                                                    fontSize: "0.85rem",
                                                }}
                                                size="small"
                                                key={d}
                                                variant={
                                                    selectedDays.includes(d)
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                onClick={() =>
                                                    handleDayToggle(d)
                                                }
                                            >
                                                {d}
                                            </Button>
                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <>
                                    {/* 비정기일 경우 특정 날짜 입력 */}
                                    <Box sx={{ mb: 3.2 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                mt: 3,
                                                mb: 1,
                                                color: theme.palette.text
                                                    .secondary,
                                            }}
                                        >
                                            활동 날짜
                                        </Typography>
                                        <CustomTextField
                                            data={customDate}
                                            setData={(value) => {
                                                setCustomDate(value);
                                                setMeta((prev) => ({
                                                    ...prev,
                                                    customDate: value,
                                                }));
                                            }}
                                            placeholder="예: 매월 1일, 5월 5일 등"
                                            padding={10}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Box
                display={"flex"}
                flexDirection={"row"}
                flex={1}
                justifyContent={"flex-end"}
                gap={2}
                width={"30%"}
                p={2}
            >
                <OneAlignedButton
                    align={"right"}
                    variant="outlined"
                    buttonWrapperSx={{
                        width: "100%",
                    }}
                    containerSx={{ width: "10%" }}
                    onClick={() => setOpen(false)}
                    buttonSx={{ borderRadius: "5px" }}
                    children={"취소"}
                />
                <OneAlignedButton
                    align={"right"}
                    buttonWrapperSx={{
                        width: "100%",
                    }}
                    containerSx={{ width: "10%" }}
                    onClick={() => onSubmit(convertToDto(meta))}
                    buttonSx={{ borderRadius: "5px" }}
                    children={"수정"}
                />
            </Box>
        </Grid>
    );
};
export default MetaEditField;
