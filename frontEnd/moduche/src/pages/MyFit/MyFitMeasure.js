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
            const data = await getAllMeasureResults();
            setMeasureResults(data);
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
            await saveMeasureResult({
                itemName: form.itemName,
                score: form.score,
                unit: form.unit,
                grade: null, // 옵션: grade 계산 로직 이후 추가 가능
                measureDate: new Date().toISOString().slice(0, 10),
            });

            alert("저장되었습니다.");

            // 저장 후 렌더링을 위해 다시 DB 조회
            await fetchResults();

            // 입력폼 초기화
            setForm({ itemName: "", score: "", unit: "" });
        } catch (err) {
            console.error(err);
            alert("저장에 실패했습니다.");
        }
    };

    // ---------------------------
    // 4) 테이블 데이터 구성
    // ---------------------------
    const columns = ["항목", "점수", "단위"];
    const tableData = measureResults.map((result) => ({
        항목: result.itemName,
        점수: result.score,
        단위: result.unit,
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
