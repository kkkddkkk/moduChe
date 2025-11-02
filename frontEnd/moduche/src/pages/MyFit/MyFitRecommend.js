import { useLocation, useNavigate } from "react-router-dom";
import { Container, Toolbar, Grid, Box } from "@mui/material";
import Layout from "../../component/common/Layout";
import Paper from "../../component/common/Paper";
import { CenterTitle, Contents100 } from "../../component/common/Text";
import { PostCard } from "../../component/common/PostCard";
import { OneAlignedButton as Button } from "../../component/common/Button";

// 샘플 운동 데이터 (추후 실제 API 대체)
const exerciseInfo = {
    걷기: {
        description: "가벼운 유산소 운동으로 심폐 기능 향상에 도움을 줍니다.",
        duration: "20~30분",
        intensity: "낮음",
        caution: "평지에서 시작하고 무릎 통증 시 속도를 줄이세요.",
        image: "/images/exercise/walking.png",
    },
    수영: {
        description:
            "전신 근육 사용으로 근지구력 향상과 체지방 감소 효과가 있습니다.",
        duration: "30~40분",
        intensity: "중간",
        caution: "심장 질환자는 수온에 유의하며 무리하지 않도록 합니다.",
        image: "/images/exercise/swimming.png",
    },
    스트레칭: {
        description: "근육 이완과 부상 예방에 효과적입니다.",
        duration: "10분",
        intensity: "낮음",
        caution: "통증이 느껴지면 즉시 중단합니다.",
        image: "/images/exercise/stretching.png",
    },
};

export default function MyFitRecommend() {
    const location = useLocation();
    const navigate = useNavigate();

    const recommendations = location.state?.recommendations || [];

    const handleBack = () => navigate(-1);

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 3 }}>
                <CenterTitle>추천 운동</CenterTitle>

                {recommendations.length > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            justifyContent: "center",
                            flexWrap: "wrap",
                            mt: 3,
                        }}
                    >
                        {recommendations.map((rec, i) => {
                            const info = exerciseInfo[rec] || {};
                            const desc = `📝 설명: ${
                                info.description || "정보 없음"
                            }\n⏱ 운동 시간: ${info.duration || "-"}\n💪 강도: ${
                                info.intensity || "-"
                            }\n⚠ 주의사항: ${info.caution || "-"}`;
                            return (
                                <PostCard
                                    key={i}
                                    postTitle={rec}
                                    imageURL={info.image}
                                    postDesc={desc}
                                />
                            );
                        })}
                    </Box>
                ) : (
                    <Paper>
                        <Contents100>
                            추천 운동 데이터가 없습니다.
                            <br /> 처방 페이지에서 먼저 진행해주세요.
                        </Contents100>
                    </Paper>
                )}

                <Button
                    variant="contained"
                    sx={{ mt: 4 }}
                    fullWidth
                    onClick={handleBack}
                >
                    이전으로 돌아가기
                </Button>
            </Container>
        </Layout>
    );
}
