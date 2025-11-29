import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Divider,
    Stack,
    useTheme,
    useMediaQuery,
    Tooltip,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import Paper from "../common/Paper";
import { ImageUpload } from "../common/ImageUpload";
import { OneAlignedButton } from "../common/Button";
import { CenterTitle, SubTitle } from "../common/Text";
import { ClipboardList } from "lucide-react";
import CustomTextField from "../common/CustomTextField";
import { RegisterTitle } from "../community/RegisterTitle";
import {
    formatPrice,
    getBannerSize,
    validateEmail,
} from "./utility/bannerUtility";
import {
    confirmBannerPayment,
    getAllBannerDurations,
    getAllBannerPriorities,
    getAllBannerTypes,
    prepareBannerPayment,
    submitBannerApply,
} from "../../api/bannerAPI/bannerAPI";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsernameFromToken, isLoggedIn } from "../../utils/auth";
import DummyPaymentModal from "../payment/DummyPaymentModal";

const BannerApplyForm = ({ onSubmit, onCheck }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const [bannerTypes, setBannerTypes] = useState([]);
    const [bannerDurations, setBannerDurations] = useState([]);
    const [bannerPriorities, setBannerPriorities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [applyAsMember, setApplyAsMember] = useState(false); // true = 회원 신청, false = 비회원 신청.
    const [loggedIn, setLoggedIn] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const [payment, setPayment] = useState(null);

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    const [form, setForm] = useState({
        name: "",
        isMember: false,
        contact: "",
        targetUrl: "",
        bannerTypeId: "",
        bannerDurationId: "",
        bannerPriorityId: "",
        guestPassword: "",
        applicantLoginId: "",
        images: [],
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const calculatePrice = () => {
        const type = bannerTypes.find((t) => t.id === form.bannerTypeId);
        const duration = bannerDurations.find(
            (d) => d.id === form.bannerDurationId
        );
        const priority = bannerPriorities.find(
            (p) => p.id === form.bannerPriorityId
        );

        if (!type || !duration || !priority) return 0;

        const base = Number(type.basePrice);
        const durationPrice = base * Number(duration.priceMultiplier);
        const finalPrice = durationPrice + Number(priority.extraPrice);

        return finalPrice;
    };

    const handleSubmit = async () => {
        if (!form.name || !form.contact || !form.targetUrl) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }
        if (form.images.length === 0) {
            alert("배너 이미지를 최소 1장 업로드해주세요.");
            return;
        }
        if (!applyAsMember && !form.guestPassword) {
            alert("비회원 비밀번호를 입력해주세요.");
            return;
        }
        if (!validateEmail(form.contact)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        const prePaymentPayload = {
            bannerTypeId: form.bannerTypeId,
            bannerDurationId: form.bannerDurationId,
            bannerPriorityId: form.bannerPriorityId,
        };

        try {
            const prePayment = await prepareBannerPayment(prePaymentPayload);

            //생성된 payment 저장.
            setPayment(prePayment);
            // 결제 팝업 열기.
            setShowPaymentPopup(true);
        } catch (err) {
            console.error("결제 준비 실패:", err);
            alert("결제를 준비할 수 없습니다.");
        }
    };

    const handleFinalSubmit = async (confirmPayment) => {
        if (!confirmPayment?.paymentId) {
            alert("결제 정보가 존재하지 않습니다.");
            return;
        }

        console.log(confirmPayment);
        try {
            //결제 승인 요청 (결제 엔티티 최종 업데이트).
            const donePaymentId = await confirmBannerPayment(confirmPayment);

            console.log(donePaymentId);

            if (!donePaymentId) {
                alert("donePaymentId가 들어오지 않음");
                return;
            }
            //배너 신청 payload.
            const payload = {
                bannerTypeId: form.bannerTypeId,
                bannerDurationId: form.bannerDurationId,
                bannerPriorityId: form.bannerPriorityId,
                ownerName: form.name,
                contact: form.contact,
                redirectUrl: form.targetUrl,
                memberApply: applyAsMember,
                applicantLoginId: applyAsMember ? form.applicantLoginId : null,
                guestPassword: applyAsMember ? null : form.guestPassword,
                paymentId: donePaymentId, //결제 ID 포함.
            };

            const formData = new FormData();
            formData.append(
                "data",
                new Blob([JSON.stringify(payload)], {
                    type: "application/json",
                })
            );

            formData.append("images", form.images[0].file);

            //최종 배너 신청 API 호출.
            await submitBannerApply(formData);

            alert("배너 신청이 완료되었습니다!");
            setShowPaymentPopup(false);
            navigate("/");
        } catch (err) {
            alert("배너 신청 중 문제가 발생했습니다.");
            console.error(err);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const types = await getAllBannerTypes();
            const durations = await getAllBannerDurations();
            const priorities = await getAllBannerPriorities();

            setBannerTypes(types);
            setBannerDurations(durations);
            setBannerPriorities(priorities);

            // 기본값 자동 선택
            setForm((prev) => ({
                ...prev,
                bannerTypeId: types[0]?.id || "",
                bannerDurationId: durations[0]?.id || "",
                bannerPriorityId: priorities[0]?.id || "",
            }));
        } catch (e) {
            console.error("배너 설정값 로딩 실패:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isUser = isLoggedIn(localStorage.getItem("accessToken"));
        setLoggedIn(isUser);
        setApplyAsMember(isUser);

        if (isUser) {
            const userName = localStorage.getItem("name");
            handleChange("name", userName);
            handleChange(
                "applicantLoginId",
                getUsernameFromToken(localStorage.getItem("accessToken"))
            );
        }

        loadData();
    }, []);

    return (
        <>
            <Paper sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item size={12} p={2}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <SubTitle
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <ClipboardList
                                        color={theme.palette.primary.main}
                                    />
                                    신청자 정보
                                </SubTitle>

                                <OneAlignedButton
                                    onClick={() => onCheck()}
                                    sx={{
                                        height: 38,
                                        whiteSpace: "nowrap",
                                        zIndex: 1000,
                                        backgroundColor: "#1363b9",
                                        fontWeight: 400,
                                        borderRadius: "55px",
                                    }}
                                    align="right"
                                    color="secondary"
                                >
                                    내 신청내역 확인
                                </OneAlignedButton>
                            </Box>

                            <Stack
                                display={"flex"}
                                flexDirection={
                                    isMobile || isTablet ? "column" : "row"
                                }
                                justifyContent={"space-between"}
                                gap={2}
                            >
                                <Grid size={isMobile || isTablet ? 12 : 6}>
                                    <RegisterTitle title={"신청자 이름"} />
                                    <CustomTextField
                                        placeholder={"이름"}
                                        padding={10}
                                        data={
                                            applyAsMember
                                                ? localStorage.getItem("name")
                                                : form.name
                                        }
                                        disabled={applyAsMember}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled":
                                                {
                                                    WebkitTextFillColor: "#555",
                                                    cursor: "not-allowed",
                                                },
                                        }}
                                        setData={(v) => handleChange("name", v)}
                                    />
                                </Grid>

                                <Grid
                                    size={isMobile || isTablet ? 12 : 6}
                                    sx={{ mb: 0 }}
                                >
                                    <RegisterTitle title={"신청자 연락처"} />
                                    <CustomTextField
                                        placeholder={"이메일"}
                                        setData={(v) =>
                                            handleChange("contact", v)
                                        }
                                        padding={10}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled":
                                                {
                                                    WebkitTextFillColor: "#555",
                                                    cursor: "not-allowed",
                                                },
                                        }}
                                    />
                                </Grid>
                            </Stack>
                            <Stack
                                display={"flex"}
                                flexDirection={
                                    isMobile || isTablet ? "column" : "row"
                                }
                                justifyContent={"space-between"}
                                mt={2}
                            >
                                <Grid
                                    size={isMobile || isTablet ? 12 : 6}
                                    sx={{ mb: 0 }}
                                >
                                    <RadioGroup
                                        row
                                        value={
                                            applyAsMember ? "MEMBER" : "GUEST"
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "MEMBER") {
                                                if (!loggedIn) {
                                                    // 3. 로그아웃 상태에서 회원으로 신청 클릭 시 로그인 페이지로 이동
                                                    alert(
                                                        "회원 신청은 로그인이 필요합니다."
                                                    );
                                                    navigate("/login"); // 실제 로그인 경로에 맞게 수정
                                                    return;
                                                }
                                                setApplyAsMember(true);
                                            } else {
                                                setApplyAsMember(false);
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            value="MEMBER"
                                            control={<Radio />}
                                            label="회원으로 신청"
                                            disabled={!isLoggedIn}
                                        />
                                        <FormControlLabel
                                            value="GUEST"
                                            control={<Radio />}
                                            label="비회원으로 신청"
                                        />
                                    </RadioGroup>
                                </Grid>

                                {!applyAsMember && (
                                    <Grid
                                        size={isMobile || isTablet ? 12 : 6}
                                        mt={isMobile || isTablet ? 1 : 0}
                                    >
                                        <RegisterTitle
                                            title={"비회원 확인용 비밀번호"}
                                        />
                                        <CustomTextField
                                            placeholder={
                                                "4자리 이상 비밀번호 입력"
                                            }
                                            type="password"
                                            setData={(v) =>
                                                handleChange("guestPassword", v)
                                            }
                                            padding={10}
                                        />
                                    </Grid>
                                )}
                            </Stack>
                        </Grid>

                        <Divider sx={{ width: "100%" }} />

                        <Grid container size={12} spacing={3}>
                            {/* 배너 옵션 */}
                            <Grid item size={12} px={2}>
                                <SubTitle
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 3,
                                    }}
                                >
                                    <ClipboardList
                                        color={theme.palette.primary.main}
                                    />
                                    배너 옵션 선택
                                </SubTitle>

                                {/* 이동 URL */}
                                <Grid size={12} mb={2}>
                                    <RegisterTitle title={"클릭 시 이동 URL"} />
                                    <CustomTextField
                                        placeholder={"https://example.com"}
                                        setData={(v) =>
                                            handleChange("targetUrl", v)
                                        }
                                        padding={10}
                                    />
                                </Grid>

                                <Stack
                                    direction={
                                        isMobile || isTablet ? "column" : "row"
                                    }
                                    gap={2}
                                >
                                    {/* 배너 타입 */}
                                    <Grid size={isMobile || isTablet ? 12 : 4}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            <RegisterTitle
                                                title={"배너 타입"}
                                            />
                                            <Tooltip
                                                title={
                                                    <>
                                                        <div>
                                                            • 메인 배너: 홈
                                                            화면에서 가장 크게
                                                            출력
                                                        </div>
                                                        <div>
                                                            • 상단 배너:
                                                            목록/상세 상단에
                                                            가로 배너로 출력
                                                        </div>
                                                        <div>
                                                            • 사이드 배너:
                                                            페이지 좌·우측
                                                            카드형으로 출력
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginTop: 6,
                                                            }}
                                                        >
                                                            각 형식에 따라 기본
                                                            금액이 다릅니다.
                                                        </div>
                                                    </>
                                                }
                                                placement="top"
                                            >
                                                <Info
                                                    size={16}
                                                    color="#666"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Tooltip>
                                        </Box>

                                        <TextField
                                            select
                                            fullWidth
                                            value={form.bannerTypeId}
                                            onChange={(e) =>
                                                handleChange(
                                                    "bannerTypeId",
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {bannerTypes.map((t) => (
                                                <MenuItem
                                                    key={t.id}
                                                    value={t.id}
                                                >
                                                    {t.label === "MAIN"
                                                        ? "메인 배너"
                                                        : t.label === "TOP"
                                                        ? "상단 배너"
                                                        : "사이드 배너"}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    {/* 노출 기간 */}
                                    <Grid size={isMobile || isTablet ? 12 : 4}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            <RegisterTitle
                                                title={"노출 기간"}
                                            />
                                            <Tooltip
                                                title={
                                                    <>
                                                        <div>
                                                            • 7일 / 14일 / 30일
                                                            중 선택 가능
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginTop: 4,
                                                            }}
                                                        >
                                                            기간별로 서로 다른
                                                            정책과
                                                        </div>
                                                        <div>
                                                            가격 가중치가
                                                            적용됩니다.
                                                        </div>
                                                    </>
                                                }
                                                placement="top"
                                            >
                                                <Info
                                                    size={16}
                                                    color="#666"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Tooltip>
                                        </Box>

                                        <TextField
                                            select
                                            fullWidth
                                            value={form.bannerDurationId}
                                            onChange={(e) =>
                                                handleChange(
                                                    "bannerDurationId",
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {bannerDurations.map((d) => (
                                                <MenuItem
                                                    key={d.id}
                                                    value={d.id}
                                                >
                                                    {d.days}일
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    {/* 배너 우선순위 */}
                                    <Grid size={isMobile || isTablet ? 12 : 4}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            <RegisterTitle title={"중요도"} />
                                            <Tooltip
                                                title={
                                                    <>
                                                        <div>
                                                            여러 배너가 함께
                                                            노출되는 경우,
                                                        </div>
                                                        <div>
                                                            설정된 중요도에 따라
                                                            상대적인
                                                        </div>
                                                        <div>
                                                            노출 우선순위가
                                                            달라집니다.
                                                        </div>
                                                    </>
                                                }
                                                placement="top"
                                            >
                                                <Info
                                                    size={16}
                                                    color="#666"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Tooltip>
                                        </Box>

                                        <TextField
                                            select
                                            fullWidth
                                            value={form.bannerPriorityId}
                                            onChange={(e) =>
                                                handleChange(
                                                    "bannerPriorityId",
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {bannerPriorities.map((p) => (
                                                <MenuItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.label} (+
                                                    {formatPrice(p.extraPrice)}
                                                    원)
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Divider sx={{ width: "100%" }} />

                        <Grid item size={12} px={2}>
                            <SubTitle
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 3,
                                }}
                            >
                                <ClipboardList
                                    color={theme.palette.primary.main}
                                />
                                배너 이미지
                            </SubTitle>{" "}
                            <ImageUpload
                                form={form}
                                setForm={setForm}
                                maxCount={1}
                            />
                            <Typography
                                fontSize={"0.9rem"}
                                textAlign={"center"}
                                color={theme.palette.text.secondary}
                                mt={2}
                            >
                                * 웹 환경에서 안정적인 출력이 가능하도록{" "}
                                {getBannerSize(form.bannerTypeId)} 크기의 이미지
                                등록을 권장합니다.
                            </Typography>
                        </Grid>
                        <Divider sx={{ width: "100%" }} />
                        {/* 가격 계산 패널 */}
                        <Grid item size={12} px={2}>
                            <Box
                                sx={{
                                    background: "#F7F7F7",
                                    p: 2,
                                    borderRadius: 2,
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    fontWeight={600}
                                    fontSize={"1.1rem"}
                                >
                                    총 예상 결제 금액
                                </Typography>

                                <Typography
                                    fontSize={"1.5rem"}
                                    fontWeight={700}
                                    mt={1}
                                >
                                    {calculatePrice().toLocaleString()} 원
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider sx={{ width: "100%" }} />

                        <Grid item size={12}>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                mb={4}
                                mt={2}
                            >
                                <Typography
                                    fontSize={"0.9rem"}
                                    textAlign={"center"}
                                    color={theme.palette.text.secondary}
                                    mb={0.7}
                                >
                                    * 배너 등록 심사는 영업일 기준 최대 7일 이상
                                    소요될 수 있습니다.
                                </Typography>
                                <Typography
                                    fontSize={"0.9rem"}
                                    textAlign={"center"}
                                    color={theme.palette.text.secondary}
                                    mb={0.7}
                                >
                                    * 심사 과정에서 불법·유해 콘텐츠, 또는
                                    운영정책 위반 사항이 발견될 경우 등록이
                                    거절되며 전액 환불 처리됩니다.
                                </Typography>
                                <Typography
                                    fontSize={"0.9rem"}
                                    textAlign={"center"}
                                    color={theme.palette.text.secondary}
                                    mb={6}
                                >
                                    * 신청 내역 확인 방법 제출한 배너 신청
                                    현황은 우측 상단의 “내 배너 등록 현황”
                                    버튼에서 확인할 수 있습니다.
                                </Typography>

                                <OneAlignedButton
                                    variant="contained"
                                    sx={{ width: "100%" }}
                                    onClick={handleSubmit}
                                    buttonWrapperSx={{
                                        width: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    배너 신청 등록하기
                                </OneAlignedButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <DummyPaymentModal
                open={showPaymentPopup}
                data={payment}
                onFail={() => {
                    setShowPaymentPopup(false);
                    alert("결제 실패하였습니다. 잠시 후 다시 시도해주세요.");
                }}
                onSuccess={handleFinalSubmit}
            />
        </>
    );
};

export default BannerApplyForm;
