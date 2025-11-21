import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import { Box, Button, Typography, List, ListItem } from "@mui/material"; // Add List, ListItem
import { getRecommendById } from "../../api/myFitAPI/myFitRecommendAPI"; // Import API call

const MyFitRecommend = () => {
    const { recommendId } = useParams(); // Get recommendId from URL
    const [recommendation, setRecommendation] = useState(null); // Single recommendation object
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecommendation = async () => {
            if (!recommendId) {
                setError("추천 ID가 제공되지 않았습니다.");
                setLoading(false);
                return;
            }
            try {
                // Fetch single recommendation from backend
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
    }, [recommendId]); // Rerun when recommendId changes

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;
    if (!recommendation) return <Contents>추천 운동 데이터를 찾을 수 없습니다.</Contents>;

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>추천 운동 상세</StartTitle>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {recommendation.recommendMvmNm}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary">
                    강도: {recommendation.intensity} | 빈도: {recommendation.frequency} | 시간: {recommendation.duration}
                </Typography>

                {recommendation.rank && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        랭크: {recommendation.rank} 등급
                    </Typography>
                )}

                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    운동 콘텐츠
                </Typography>
                {recommendation.contents && recommendation.contents.length > 0 ? (
                    <List>
                        {recommendation.contents.map((content, index) => (
                            <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {content.sportsStepNm}
                                </Typography>
                                {content.videoUrl && (
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                        href={content.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer" // Security best practice
                                    >
                                        운동 영상 보기
                                    </Button>
                                )}
                                {!content.videoUrl && <Typography variant="body2" color="text.secondary">영상 없음</Typography>}
                            </Paper>
                        ))}
                    </List>
                ) : (
                    <Contents>관련 운동 콘텐츠가 없습니다.</Contents>
                )}
            </Paper>
        </Box>
    );
};

export default MyFitRecommend;