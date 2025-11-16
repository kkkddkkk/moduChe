import { useEffect, useState } from "react";
import CustomTable from "../../component/common/CustomTable";
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import { Box, Button, Typography } from "@mui/material";

const MyFitRecommend = () => {
    const [recomList, setRecomList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 나중에 사용자 정보 기반 필터 가능
    const disabilityType = "시각장애";

    useEffect(() => {
        const loadRecommend = async () => {
            try {
                const response = await fetch("/data/recommendations.json");
                const json = await response.json();

                // 장애 유형 기준 필터
                const filtered = json.filter(
                    (rec) => rec.disabilityType === disabilityType
                );
                setRecomList(filtered);
            } catch (err) {
                console.error(err);
                setError("추천 운동 데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadRecommend();
    }, []);

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;

    const columns = ["운동명", "강도", "빈도", "시간"];
    const tableData = recomList.map((rec) => ({
        운동명: rec.recommendMvmNm,
        강도: rec.intensity,
        빈도: rec.frequency,
        시간: rec.duration,
    }));

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>추천 운동</StartTitle>

            <Paper sx={{ p: 2, mb: 3 }}>
                <CustomTable columns={columns} datas={tableData} />
            </Paper>

            {/* 상세 정보 + 영상 */}
            {recomList.map((rec) => (
                <Paper key={rec.recommendMvmNm} sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {rec.recommendMvmNm}
                    </Typography>

                    <Contents>
                        강도: {rec.intensity}
                        <br />
                        빈도: {rec.frequency}
                        <br />
                        시간: {rec.duration}
                    </Contents>

                    {rec.videoUrl && (
                        <Button
                            variant="contained"
                            sx={{ mt: 1 }}
                            href={rec.videoUrl}
                            target="_blank"
                        >
                            운동 영상 보기
                        </Button>
                    )}
                </Paper>
            ))}
        </Box>
    );
};

export default MyFitRecommend;
