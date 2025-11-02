import { useLocation, useNavigate } from "react-router-dom";
import { Container, Toolbar, Typography, Divider } from "@mui/material";
import Layout from "../../component/common/Layout";
import Paper from "../../component/common/Paper";
import {
    CenterTitle,
    SubTitle,
    Contents100,
} from "../../component/common/Text";
import { OneAlignedButton } from "../../component/common/Button";

const generatePrescription = (measureData) => {
    if (!measureData) return null;

    const { sex, age, disability, results } = measureData;

    const cardio = Number(results.cardio?.value || 0);
    const strength = Number(results.strength?.value || 0);

    let basePrescription = "사전운동: 가벼운 스트레칭 / 본운동: ";
    let recommendations = [];

    if (cardio < 400) {
        basePrescription += "걷기 20분 / 마무리운동: 정리 스트레칭";
        recommendations.push("걷기", "스트레칭");
    } else if (cardio < 600) {
        basePrescription += "자전거 30분 / 마무리운동: 가벼운 요가";
        recommendations.push("실내 자전거", "요가");
    } else {
        basePrescription += "수영 40분 / 마무리운동: 전신 스트레칭";
        recommendations.push("수영", "아쿠아로빅");
    }

    if (disability === "지체장애") {
        recommendations.push("휠체어 트레이닝");
    } else if (disability === "시각장애") {
        recommendations.push("밴드 체조");
    }

    return {
        prescription: basePrescription,
        recommendations,
    };
};

const parsePrescription = (text) => {
    if (!text) return [];
    const regex = /(사전운동|본운동|마무리운동)[:：]\s*([^\/]+)/g;
    const matches = [...text.matchAll(regex)];
    return matches.map((m) => ({
        step: m[1],
        content: m[2].trim(),
    }));
};

export default function MyFitPrescription() {
    const location = useLocation();
    const navigate = useNavigate();
    const measureData = location.state?.form || null;

    const resultData = generatePrescription(measureData);
    const prescriptionSteps = parsePrescription(resultData?.prescription);

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 3 }}>
                <CenterTitle>개인 맞춤 운동 처방 결과</CenterTitle>

                {measureData ? (
                    <>
                        <Paper>
                            <SubTitle>입력 정보</SubTitle>
                            <Contents100>
                                성별:{" "}
                                {measureData.sex === "M" ? "남성" : "여성"} |{" "}
                                연령대: {measureData.age} | 장애유형:{" "}
                                {measureData.disability}
                            </Contents100>

                            <Divider sx={{ my: 2 }} />

                            <SubTitle>측정 결과</SubTitle>
                            {Object.entries(measureData.results).map(
                                ([key, val]) => (
                                    <Contents100 key={key}>
                                        {`${key.toUpperCase()} — 측정방법: ${
                                            val.type || "-"
                                        } / 결과: ${val.value || "-"} `}
                                    </Contents100>
                                )
                            )}
                        </Paper>

                        <Paper>
                            <SubTitle>운동 처방</SubTitle>
                            {prescriptionSteps &&
                            prescriptionSteps.length > 0 ? (
                                prescriptionSteps.map((s, i) => (
                                    <Contents100 key={i}>
                                        <strong>{s.step}:</strong> {s.content}
                                    </Contents100>
                                ))
                            ) : (
                                <Contents100>
                                    운동 처방 내용을 불러오지 못했습니다.
                                </Contents100>
                            )}
                        </Paper>

                        <Paper>
                            <SubTitle>추천 운동</SubTitle>
                            {resultData?.recommendations?.length ? (
                                resultData.recommendations.map((rec, i) => (
                                    <Contents100 key={i}>- {rec}</Contents100>
                                ))
                            ) : (
                                <Contents100>추천 운동이 없습니다.</Contents100>
                            )}
                        </Paper>
                    </>
                ) : (
                    <Paper>
                        <Typography align="center" sx={{ p: 3 }}>
                            측정 데이터가 없습니다.
                            <br />
                            체력 측정 페이지에서 먼저 값을 입력해주세요.
                        </Typography>
                    </Paper>
                )}

                <OneAlignedButton
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() =>
                        navigate("/myfit/recommend", {
                            state: {
                                recommendations: resultData.recommendations,
                            },
                        })
                    }
                >
                    추천 운동 보기
                </OneAlignedButton>
            </Container>
        </Layout>
    );
}
