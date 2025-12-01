import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Paper from "../../component/common/Paper";
import { CenterTitle, Contents } from "../../component/common/Text"; // Use CenterTitle for centering
import Loading from "../../component/common/Loading";
import {
    Box,
    Button,
    Typography,
    List,
    Grid,
    Container,
    Card,
    CardActionArea,
    CardContent,
    Badge,
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from "@mui/material";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Timer from "@mui/icons-material/Timer";
import {
    getRecommendById,
    getRecommendationsByCriteria,
} from "../../api/myFitAPI/myFitRecommendAPI";
import { OutlinedSelect } from "../../component/common/CustomSelect"; // Import CustomSelect
import SearchIcon from "@mui/icons-material/Search"; // Import an icon for empty state

// --- Search UI Data ---
const ageGroups = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const genders = [
    { value: "M", label: "남성" },
    { value: "F", label: "여성" },
];
const disabilityTypes = [
    "지적장애",
    "청각장애",
    "자폐성장애",
    "뇌병변장애",
    "정신장애",
    "시각장애",
    "신장장애",
    "언어장애",
    "지체장애",
    "척수장애",
    "심장장애",
];
const disabilityGrades = {
    척수장애: ["완전 마비", "불완전 마비"],
    default: ["1등급", "2등급", "3등급", "4등급", "5등급", "6등급"],
};

// --- Main Component ---
const MyFitRecommend = () => {
    const { recommendId } = useParams();

    // If recommendId exists, we are in "Details View"
    if (recommendId) {
        return <RecommendationDetails recommendId={recommendId} />;
    }

    // Otherwise, we are in "Finder/Search View"
    return <RecommendationFinder />;
};

// --- Details View Component ---
const RecommendationDetails = ({ recommendId }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Temporary Mock Data for UI demonstration based on ideal content structure
    const mockContents = [
        {
            sportsStepNm: "1단계: 준비 운동 및 스트레칭",
            description:
                "의자에 앉아 편안한 자세를 취하고, 목과 어깨를 부드럽게 돌리며 몸을 이완합니다. 심호흡을 5회 반복하여 긴장을 풀어줍니다.",
            repsAndDuration: "5분",
            tips: "통증이 느껴지지 않는 범위 내에서 천천히 움직이세요.",
            videoUrl: "https://www.youtube.com/watch?v=mock_video_id_1",
        },
        {
            sportsStepNm: "2단계: 상체 근력 운동 (팔 들어 올리기)",
            description:
                "등을 곧게 펴고 앉은 상태에서 양팔을 옆으로 천천히 들어 올려 귀 높이까지 올립니다. 숨을 내쉬면서 팔을 내리고 들이쉬면서 다시 올립니다.",
            repsAndDuration: "10회씩 3세트 (세트당 30초 휴식)",
            tips: "어깨에 무리가 가지 않도록 주의하고, 팔을 높이 들기 어렵다면 할 수 있는 만큼만 올리세요. 휠체어 사용자는 등받이에 기대어 안정성을 확보하세요.",
            videoUrl: "https://www.youtube.com/watch?v=mock_video_id_2",
        },
        {
            sportsStepNm: "3단계: 마무리 스트레칭",
            description:
                "운동했던 부위를 중심으로 가볍게 스트레칭하여 근육을 이완시킵니다. 심호흡을 하며 편안한 상태로 돌아옵니다.",
            repsAndDuration: "5분",
            tips: "무리하게 스트레칭하지 말고, 시원함을 느끼는 정도에서 유지하세요.",
            videoUrl: null,
        },
    ];

    useEffect(() => {
        const loadRecommendation = async () => {
            try {
                const data = await getRecommendById(recommendId);
                setRecommendation(data);
            } catch (err) {
                console.error(err);
                setError("추천 운동 데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadRecommendation();
    }, [recommendId]);

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;
    if (!recommendation)
        return <Contents>추천 운동 데이터를 찾을 수 없습니다.</Contents>;

    return (
        <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto" }}>
            <CenterTitle sx={{ mb: 3 }}>추천 운동 상세</CenterTitle>

            <Grid container spacing={4}>
                {/* Left side: Video */}
                <Grid item xs={12} md={6}>
                    {
                        <Box
                            sx={{
                                position: "relative",
                                paddingTop: "56.25%", // 16:9 Aspect Ratio
                                height: 0,
                                overflow: "hidden",
                                mb: 3,
                                borderRadius: "12px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            }}
                        ></Box>
                    }
                </Grid>

                {/* Right side: Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: "100%", borderRadius: "12px" }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            운동 정보
                        </Typography>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ mb: 2, color: "primary.main" }}
                        >
                            {recommendation.recommendMvmNm}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {/* Left Column: Guidelines */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    gutterBottom
                                >
                                    운동 가이드라인
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1.5,
                                    }}
                                >
                                    <FitnessCenter
                                        sx={{
                                            mr: 1.5,
                                            color: "text.secondary",
                                        }}
                                    />
                                    <Typography>
                                        강도:{" "}
                                        {recommendation.intensity ||
                                            "정보 없음"}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1.5,
                                    }}
                                >
                                    <EventRepeat
                                        sx={{
                                            mr: 1.5,
                                            color: "text.secondary",
                                        }}
                                    />
                                    <Typography>
                                        빈도:{" "}
                                        {recommendation.frequency ||
                                            "정보 없음"}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Timer
                                        sx={{
                                            mr: 1.5,
                                            color: "text.secondary",
                                        }}
                                    />
                                    <Typography>
                                        시간:{" "}
                                        {recommendation.duration || "정보 없음"}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Right Column: Recommendation Context */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    gutterBottom
                                >
                                    추천 근거 정보
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    나이:{" "}
                                    {recommendation.agrdeFlagNm || "정보 없음"}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    성별:{" "}
                                    {{ M: "남성", F: "여성" }[
                                        recommendation.sexdstnFlagCd
                                    ] || "정보 없음"}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    장애 유형:{" "}
                                    {recommendation.troblTyNm || "정보 없음"}
                                </Typography>
                                {recommendation.rank && (
                                    <Typography variant="body2">
                                        추천 순위: {recommendation.rank} 등급
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Steps/Contents List - Using Mock Data for structured display */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    운동 단계별 안내
                </Typography>
                <Stepper orientation="vertical" nonLinear activeStep={-1}>
                    {mockContents.map((content, index) => (
                        <Step key={index} expanded={true}>
                            <StepLabel>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    {content.sportsStepNm}
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                {content.description && (
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, mb: 1 }}
                                    >
                                        {content.description}
                                    </Typography>
                                )}
                                {content.repsAndDuration && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        <Box component="span" fontWeight="bold">
                                            반복/시간:
                                        </Box>{" "}
                                        {content.repsAndDuration}
                                    </Typography>
                                )}
                                {content.tips && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        <Box component="span" fontWeight="bold">
                                            팁:
                                        </Box>{" "}
                                        {content.tips}
                                    </Typography>
                                )}
                                {content.videoUrl && (
                                    <Button
                                        variant="outlined"
                                        href={content.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        이 단계 영상 보기
                                    </Button>
                                )}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Box>
    );
};

// --- Finder/Search View Component ---

const RecommendationFinder = () => {
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [selectedAge, setSelectedAge] = useState("");

    const [selectedGender, setSelectedGender] = useState("");

    const [selectedDisabilityType, setSelectedDisabilityType] = useState("");

    const [selectedGrade, setSelectedGrade] = useState("");

    const handleSearch = async () => {
        if (
            !selectedAge ||
            !selectedGender ||
            !selectedDisabilityType ||
            !selectedGrade
        ) {
            setError("모든 필드를 선택해주세요.");

            return;
        }

        setError(null);

        setLoading(true);

        try {
            const criteria = {
                age: selectedAge.value, // Extract value

                gender: selectedGender.value, // Extract value

                disabilityType: selectedDisabilityType.value, // Extract value

                disabilityGrade: selectedGrade.value, // Extract value
            };

            const data = await getRecommendationsByCriteria(criteria);

            // 1. 순위별로 그룹화

            const groupedByRank = data.reduce((acc, item) => {
                const rank = item.rank || "기타";

                if (!acc[rank]) {
                    acc[rank] = [];
                }

                acc[rank].push(item);

                return acc;
            }, {});

            // 2. 각 순위 그룹에서 첫 번째 항목만 선택 (가장 대표적인 하나)

            const oneRecommendationPerRank = Object.values(groupedByRank).map(
                (group) => group[0]
            );

            // 3. 최종 목록을 순위 기준으로 정렬

            const sortedRecommendations = oneRecommendationPerRank.sort(
                (a, b) => {
                    const rankA = a.rank || Infinity; // '기타' 랭크는 가장 뒤로

                    const rankB = b.rank || Infinity;

                    return rankA - rankB;
                }
            );

            setRecommendations(sortedRecommendations);
        } catch (err) {
            console.error(err);

            setError("추천 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // Adjust currentGrades to return objects for CustomSelect if needed

    const currentGradesData =
        selectedDisabilityType === "척수장애"
            ? disabilityGrades["척수장애"].map((grade) => ({
                  value: grade,
                  label: grade,
              }))
            : disabilityGrades.default.map((grade) => ({
                  value: grade,
                  label: grade,
              }));

    const initialRender =
        !loading &&
        !error &&
        recommendations.length === 0 &&
        !selectedAge &&
        !selectedGender &&
        !selectedDisabilityType &&
        !selectedGrade;

    // Group recommendations by rank for rendering

    const groupedRecommendations = recommendations.reduce((acc, rec) => {
        const rank = rec.rank || "기타"; // Handle items without a rank

        if (!acc[rank]) {
            acc[rank] = [];
        }

        acc[rank].push(rec);

        return acc;
    }, {});

    const sortedRanks = Object.keys(groupedRecommendations).sort((a, b) => {
        if (a === "기타") return 1;

        if (b === "기타") return -1;

        return a - b;
    });

    return (
        <Box
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            {" "}
            {/* Added width: '100%' */}
            <Container maxWidth="xl" sx={{ mb: 3 }}>
                {" "}
                {/* Use Container for better max-width control */}
                <CenterTitle>맞춤 운동 추천 찾기</CenterTitle>{" "}
                {/* Changed StartTitle to CenterTitle */}
                <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <OutlinedSelect
                                data={ageGroups.map((age) => ({
                                    value: age,
                                    label: age,
                                }))}
                                selected={selectedAge}
                                setSelected={setSelectedAge}
                                placeholder="나이대"
                                size="medium"
                                padding="12px"
                                format={(d) => d.label}
                                renderValue={(
                                    selected // Custom renderValue for centering text
                                ) => (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                    >
                                        {typeof selected === "object"
                                            ? selected.label
                                            : selected}
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <OutlinedSelect
                                data={genders}
                                selected={selectedGender}
                                setSelected={setSelectedGender}
                                placeholder="성별"
                                size="medium"
                                padding="12px"
                                format={(d) => d.label}
                                renderValue={(selected) => {
                                    // Custom renderValue for centering text and showing label

                                    if (!selected) {
                                        return (
                                            <Box
                                                sx={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                    color: "gray",
                                                }}
                                            >
                                                성별
                                            </Box>
                                        ); // Show placeholder text with gray color
                                    }

                                    if (
                                        typeof selected === "object" &&
                                        selected.label
                                    ) {
                                        return (
                                            <Box
                                                sx={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                {selected.label}
                                            </Box>
                                        );
                                    }

                                    // If selected is a primitive value (e.g., "M" or "F"), find its corresponding label

                                    const option = genders.find(
                                        (item) => item.value === selected
                                    );

                                    return (
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                        >
                                            {option ? option.label : selected}
                                        </Box>
                                    );
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <OutlinedSelect
                                data={disabilityTypes.map((type) => ({
                                    value: type,
                                    label: type,
                                }))}
                                selected={selectedDisabilityType}
                                setSelected={setSelectedDisabilityType}
                                placeholder="장애분류"
                                size="medium"
                                padding="12px"
                                format={(d) => d.label}
                                renderValue={(
                                    selected // Custom renderValue for centering text
                                ) => (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                    >
                                        {typeof selected === "object"
                                            ? selected.label
                                            : selected}
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <OutlinedSelect
                                data={currentGradesData}
                                selected={selectedGrade}
                                setSelected={setSelectedGrade}
                                placeholder="등급"
                                size="medium"
                                padding="12px"
                                disabled={!selectedDisabilityType}
                                format={(d) => d.label}
                                renderValue={(
                                    selected // Custom renderValue for centering text
                                ) => (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                    >
                                        {typeof selected === "object"
                                            ? selected.label
                                            : selected}
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ mt: 3, width: "100%", py: 1.5 }}
                    >
                        추천 찾기
                    </Button>
                </Paper>
            </Container>
            {loading && <Loading />}
            {error && <Contents sx={{ color: "red", mt: 2 }}>{error}</Contents>}
            {initialRender && (
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 5,
                        p: 4,

                        border: "2px dashed #a0a0a0",
                        borderRadius: "12px",

                        maxWidth: 600,
                        width: "100%",
                        mx: "auto", // Centering the initial message box

                        bgcolor: "grey.50", // Light background color
                    }}
                >
                    <SearchIcon
                        sx={{ fontSize: 70, color: "text.secondary", mb: 3 }}
                    />{" "}
                    {/* Increased icon size */}
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        fontWeight="bold"
                    >
                        나만을 위한 맞춤 운동을 찾아보세요!
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                    >
                        위에 있는 조건을 선택하면 당신에게 꼭 맞는 운동을 추천해
                        드립니다.
                    </Typography>
                </Box>
            )}
            {!loading && !error && !initialRender && (
                <Container maxWidth="xl" sx={{ mt: 3 }}>
                    {recommendations.length > 0 && (
                        <CenterTitle sx={{ mb: 3 }}>추천 운동 목록</CenterTitle>
                    )}

                    {recommendations.length > 0 ? (
                        <Grid container spacing={3}>
                            {" "}
                            {/* Single Grid container for all cards */}
                            {recommendations.map((rec) => (
                                <Grid
                                    item
                                    key={rec.recommendId}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    {" "}
                                    {/* Responsive grid items */}
                                    <Badge
                                        badgeContent={rec.rank || "기타"} // Use Badge to show rank
                                        color="primary"
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                        sx={{
                                            width: "100%",

                                            "& .MuiBadge-badge": {
                                                top: 15,

                                                left: 15,

                                                right: "auto",

                                                transform: "none",

                                                borderRadius: "8px",

                                                fontSize: "0.8rem",

                                                fontWeight: "bold",

                                                padding: "0 8px",

                                                height: "auto",

                                                lineHeight: "20px",
                                            },
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                display: "flex",

                                                height: "100%",

                                                borderRadius: "12px",

                                                boxShadow:
                                                    "0 4px 12px rgba(0,0,0,0.08)",

                                                transition:
                                                    "transform 0.2s, box-shadow 0.2s",

                                                "&:hover": {
                                                    transform:
                                                        "translateY(-4px)",

                                                    boxShadow:
                                                        "0 8px 20px rgba(0,0,0,0.12)",
                                                },

                                                pt: 0, // No extra padding needed here, badge handles its space

                                                pl: 0,

                                                position: "relative", // For badge positioning
                                            }}
                                        >
                                            <CardActionArea
                                                component={Link}
                                                to={`/myFit/recommend/${rec.recommendId}`}
                                                sx={{
                                                    display: "flex",
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {/* Left Section: Icon */}

                                                <Box
                                                    sx={{
                                                        minWidth: 80, // Fixed width for icon

                                                        display: "flex",

                                                        alignItems: "center",

                                                        justifyContent:
                                                            "center",

                                                        bgcolor:
                                                            "primary.light", // Light primary background

                                                        color: "primary.contrastText", // White icon color

                                                        borderRadius:
                                                            "12px 0 0 12px",
                                                    }}
                                                >
                                                    {/* Placeholder for future image or icon */}
                                                </Box>

                                                {/* Right Section: Content */}

                                                <CardContent
                                                    sx={{
                                                        flexGrow: 1,
                                                        py: 2,
                                                        px: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        noWrap
                                                    >
                                                        {rec.recommendMvmNm}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        강도:{" "}
                                                        {rec.intensity ||
                                                            "정보 없음"}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        빈도:{" "}
                                                        {rec.frequency ||
                                                            "정보 없음"}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        시간:{" "}
                                                        {rec.duration ||
                                                            "정보 없음"}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Badge>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper sx={{ p: 3, mt: 2 }} elevation={1}>
                            <Contents>
                                검색 조건에 맞는 추천 운동이 없습니다.
                            </Contents>
                        </Paper>
                    )}
                </Container>
            )}
        </Box>
    );
};

export default MyFitRecommend;
