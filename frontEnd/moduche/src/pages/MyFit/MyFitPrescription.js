import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPrescriptionByUser } from "../../api/myFitAPI/myFitPrescriptionAPI";
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import { Box, Typography, List, ListItem, Divider, Tabs, Tab } from "@mui/material";

const MyFitPrescription = () => {
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const loadPrescription = async () => {
            try {
                // Fetch prescription from backend (assuming user ID 1 for now)
                const data = await getPrescriptionByUser(1);

                if (data && data.length > 0) {
                    setPrescription(data[0]);
                } else {
                    setError("처방 데이터를 찾을 수 없습니다.");
                }
            } catch (err) {
                console.error(err);
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadPrescription();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;
    if (!prescription) return <Contents>처방 데이터가 없습니다.</Contents>;

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>운동 처방</StartTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="prescription tabs">
                    <Tab label="종합 처방" />
                    <Tab label="추천 운동" />
                </Tabs>
            </Box>

            {/* 종합 처방 탭 */}
            {tabIndex === 0 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        상세 운동 처방
                    </Typography>
                    {(() => {
                        try {
                            const parsedContent = JSON.parse(prescription.prescriptionContent);
                            return (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                        사전 운동
                                    </Typography>
                                    <List dense>
                                        {parsedContent.pre_exercise && parsedContent.pre_exercise.map((ex, idx) => (
                                            <ListItem key={idx}>
                                                <Typography>{ex.name} ({ex.duration})</Typography>
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                        본 운동
                                    </Typography>
                                    <List dense>
                                        {parsedContent.main_exercise && parsedContent.main_exercise.map((ex, idx) => (
                                            <ListItem key={idx}>
                                                <Typography>{ex.name} ({ex.duration}, 강도: {ex.intensity})</Typography>
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                        마무리 운동
                                    </Typography>
                                    <List dense>
                                        {parsedContent.cool_down && parsedContent.cool_down.map((ex, idx) => (
                                            <ListItem key={idx}>
                                                <Typography>{ex.name} ({ex.duration})</Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            );
                        } catch (e) {
                            console.error("Failed to parse prescription content JSON:", e);
                            return <Contents>처방 내용을 불러올 수 없습니다. (JSON 파싱 오류)</Contents>;
                        }
                    })()}
                </Paper>
            )}

            {/* 추천 운동 탭 */}
            {tabIndex === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        추천 운동 목록 (운동 이름을 클릭하면 상세 정보로 이동합니다.)
                    </Typography>
                    <List>
                        {prescription.recommends && prescription.recommends.length > 0 ? (
                            prescription.recommends.map((rec, index) => (
                                <Box key={rec.recommendId}>
                                    <ListItem
                                        button
                                        component={Link}
                                        to={`/myfit/recommend/${rec.recommendId}`}
                                    >
                                        <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                                            {rec.recommendMvmNm}
                                        </Typography>
                                    </ListItem>
                                    {index < prescription.recommends.length - 1 && <Divider />}
                                </Box>
                            ))
                        ) : (
                            <ListItem>
                                <Contents>추천 운동이 없습니다.</Contents>
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default MyFitPrescription;