import { useEffect, useState } from "react";
import { getPrescriptionByUser } from "../../api/myFitAPI/myFitPrescriptionAPI";
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import { Box, Typography, List, ListItem, Divider } from "@mui/material";

const MyFitPrescription = () => {
    const [prescription, setPrescription] = useState(null);
    const [jsonExtra, setJsonExtra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPrescription = async () => {
            try {
                const data = await getPrescriptionByUser(1);
                setPrescription(data);

                // JSON 파일 불러오기
                const response = await fetch("/data/prescriptions.json");
                const json = await response.json();

                // 성별 + 장애유형 + 디테일 기반 필터
                const matched = json.find(
                    (item) =>
                        item.sexdstnFlagCd === data.sexdstnFlagCd &&
                        item.troblTyNm === data.troblTyNm &&
                        item.troblDetailNm === data.troblDetailNm
                );

                setJsonExtra(matched);
            } catch (err) {
                console.error(err);
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadPrescription();
    }, []);

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>운동 처방</StartTitle>

            {/* 기본 처방 */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    기본 처방 내용
                </Typography>
                <Contents>{prescription.prescriptionContent}</Contents>
            </Paper>

            {/* JSON 확장 처방 */}
            {jsonExtra && (
                <>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            추가 지침
                        </Typography>
                        <Contents>{jsonExtra.recommendation}</Contents>
                    </Paper>

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            추천 운동 목록
                        </Typography>
                        <List>
                            {jsonExtra.exerciseList.map((ex) => (
                                <ListItem key={ex}>{ex}</ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            운동 팁
                        </Typography>
                        <Contents>{jsonExtra.tip}</Contents>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default MyFitPrescription;
