import { useState } from "react";
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getRecommendationsByCriteria } from "../../api/myFitAPI/myFitRecommendAPI";

// Hardcoded options based on user's information
const ageGroups = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const genders = { M: "남성", F: "여성" };
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

const MyFitRecommendationFinder = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for user selections
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
                age: selectedAge,
                gender: selectedGender,
                disabilityType: selectedDisabilityType,
                disabilityGrade: selectedGrade,
            };
            const data = await getRecommendationsByCriteria(criteria);
            setRecommendations(data);
        } catch (err) {
            console.error(err);
            setError("추천 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const currentGrades =
        selectedDisabilityType === "척수장애"
            ? disabilityGrades["척수장애"]
            : disabilityGrades.default;

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>맞춤 운동 추천 찾기</StartTitle>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>나이대</InputLabel>
                            <Select
                                value={selectedAge}
                                label="나이대"
                                onChange={(e) => setSelectedAge(e.target.value)}
                            >
                                {ageGroups.map((age) => (
                                    <MenuItem key={age} value={age}>
                                        {age}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>성별</InputLabel>
                            <Select
                                value={selectedGender}
                                label="성별"
                                onChange={(e) =>
                                    setSelectedGender(e.target.value)
                                }
                                renderValue={(selectedValue) =>
                                    genders[selectedValue]
                                }
                            >
                                {Object.entries(genders).map(([code, name]) => (
                                    <MenuItem key={code} value={code}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>장애분류</InputLabel>
                            <Select
                                value={selectedDisabilityType}
                                label="장애분류"
                                onChange={(e) => {
                                    setSelectedDisabilityType(e.target.value);
                                    setSelectedGrade(""); // Reset grade when type changes
                                }}
                            >
                                {disabilityTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl
                            fullWidth
                            disabled={!selectedDisabilityType}
                        >
                            <InputLabel>등급</InputLabel>
                            <Select
                                value={selectedGrade}
                                label="등급"
                                onChange={(e) =>
                                    setSelectedGrade(e.target.value)
                                }
                            >
                                {currentGrades.map((grade) => (
                                    <MenuItem key={grade} value={grade}>
                                        {grade}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ mt: 2 }}
                >
                    추천 찾기
                </Button>
            </Paper>

            {loading && <Loading />}
            {error && <Contents sx={{ color: "red" }}>{error}</Contents>}

            {!loading && !error && (
                <Paper>
                    <List>
                        {recommendations.length > 0 ? (
                            recommendations.map((rec) => (
                                <ListItem
                                    key={rec.id}
                                    component={Link}
                                    to={`/my-fit/recommend/${rec.id}`}
                                    sx={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <Paper sx={{ p: 2, width: "100%" }}>
                                        <Typography variant="h6">
                                            {rec.RECOMEND_MVM_NM}
                                        </Typography>
                                        <Typography>
                                            추천 순위:{" "}
                                            {
                                                rec.FLAG_ACCTO_RECOMEND_MVM_RANK_CO
                                            }
                                        </Typography>
                                    </Paper>
                                </ListItem>
                            ))
                        ) : (
                            <Contents>
                                검색 조건에 맞는 추천 운동이 없습니다.
                            </Contents>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default MyFitRecommendationFinder;
