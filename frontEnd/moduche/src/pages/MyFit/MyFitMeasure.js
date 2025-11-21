import { useEffect, useState } from "react";
import {
    getAllMeasureResults,
    saveMeasureResult,
} from "../../api/myFitAPI/myFitMeasureAPI";
import CustomTable from "../../component/common/CustomTable";
import Paper from "../../component/common/Paper";
import { StartTitle, Contents } from "../../component/common/Text";
import Loading from "../../component/common/Loading";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { calculateGrade } from "../../utils/gradingCriteria";

const MyFitMeasure = () => {
    const [measureResults, setMeasureResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // JSON 기반 항목 리스트
    const [itemList, setItemList] = useState([]);

    // 입력폼 상태
    const [form, setForm] = useState({
        itemName: "",
        score: "",
        unit: "",
    });

    // ---------------------------
    // 1) 초기 데이터 로드
    // ---------------------------
    const fetchResults = async () => {
        try {
            // 백엔드에서 중첩된 구조의 데이터를 반환 (List<MyFitMeasureResponseDTO>)
            const nestedData = await getAllMeasureResults();

            // flatMap을 사용하여 중첩된 results 배열을 단일 배열로 평탄화
            const flatData = nestedData.flatMap(measure => measure.results || []);
            
            setMeasureResults(flatData);
        } catch (error) {
            setError("측정 결과를 불러오는 데 실패했습니다.");
            console.error("Error fetching measure results:", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                // DB 데이터 불러오기
                await fetchResults();

                // JSON 기반 측정 항목 불러오기
                const response = await fetch("/data/measure-items.json");
                const json = await response.json();
                setItemList(json);
            } catch (err) {
                console.error(err);
                setError("초기 데이터를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    // ---------------------------
    // 2) JSON 항목 선택 시 단위 자동 적용
    // ---------------------------
    const handleItemChange = (e) => {
        const selected = itemList.find((it) => it.itemName === e.target.value);
        setForm({
            ...form,
            itemName: selected.itemName,
            unit: selected.unit, // 단위 자동 입력
        });
    };

    // ---------------------------
    // 3) 측정값 저장 + 저장 후 자동 재렌더링
    // ---------------------------
    const handleSave = async () => {
        try {
            // 등급 계산
            const grade = calculateGrade(form.itemName, form.score);
            if (!grade) {
                alert("해당 항목의 등급을 계산할 수 없습니다. 기준을 확인해주세요.");
                return;
            }
            // 백엔드 MyFitMeasureRequestDTO 구조에 맞게 요청 데이터를 구성
            const requestData = {
                userId: 1, // TODO: 실제 사용자 ID로 교체 필요
                centerName: "모두체", // TODO: 실제 센터 이름으로 교체 필요
                measurePlaceFlagNm: "체력인증센터", // 예시값
                measureAge: 30, // 예시값
                inputFlagNm: "직접입력", // 예시값
                measureDate: new Date().toISOString().slice(0, 10),
                results: [ // 결과를 배열로 감싸기
                    {
                        itemName: form.itemName,
                        score: parseFloat(form.score), // 숫자로 변환
                        unit: form.unit,
                        grade: grade, // 계산된 등급 사용
                    },
                ],
            };

            await saveMeasureResult(requestData);

            alert("저장되었습니다.");

            // 저장 후 렌더링을 위해 다시 DB 조회
            await fetchResults();

            // 입력폼 초기화
            setForm({ itemName: "", score: "", unit: "" });
        } catch (err) {
            console.error("Error saving measure result:", err);
            // 백엔드에서 전송된 특정 에러 메시지 확인
            if (err.response && err.response.data && typeof err.response.data === 'string' && err.response.data.includes("AccessibilityProfile not found")) {
                alert("오류: 사용자의 신체 정보 프로필을 찾을 수 없습니다. 처방을 생성하려면 프로필을 먼저 완성해야 합니다.");
            } else {
                alert("저장에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    // ---------------------------
    // 4) 테이블 데이터 구성
    // ---------------------------
    const columns = ["항목", "점수", "단위", "기본 처방"];
    const tableData = measureResults.map((result) => ({
        항목: result.itemName,
        점수: result.score,
        단위: result.unit,
        "기본 처방": result.prescriptionContent,
    }));

    if (loading) return <Loading />;
    if (error) return <Contents>{error}</Contents>;

    return (
        <Box sx={{ p: 3 }}>
            <StartTitle>측정 입력</StartTitle>

            {/* 입력 폼 */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        select
                        label="측정 항목"
                        value={form.itemName}
                        onChange={handleItemChange}
                        sx={{ minWidth: 200 }}
                    >
                        {itemList.map((item) => (
                            <MenuItem key={item.itemName} value={item.itemName}>
                                {item.itemName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="점수"
                        type="number"
                        value={form.score}
                        onChange={(e) =>
                            setForm({ ...form, score: e.target.value })
                        }
                    />

                    <TextField label="단위" value={form.unit} disabled />

                    <Button variant="contained" onClick={handleSave}>
                        저장
                    </Button>
                </Box>
            </Paper>

            {/* 저장된 값 출력 */}
            <StartTitle>측정 결과</StartTitle>
            <Paper>
                <CustomTable columns={columns} datas={tableData} />
            </Paper>
        </Box>
    );
};

export default MyFitMeasure;