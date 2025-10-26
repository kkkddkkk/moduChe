import React, { useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import Layout from "../../component/common/Layout";
import {
    CenterTitle,
    Contents100,
    SubTitle,
} from "../../component/common/Text";
import CustomTextField from "../../component/common/CustomTextField";
import { TwoAlignedButtons } from "../../component/common/Button";

// 📘 mock 기준: 실제 JSON에서 사용된 항목 (참고)
const disabilityTypes = [
    "지체장애",
    "시각장애",
    "청각장애",
    "지적장애",
    "뇌병변장애",
];

const measureItems = [
    {
        key: "cardio",
        label: "심폐지구력",
        desc: "1200m 달리기·걷기 테스트",
        unit: "분/초",
    },
    { key: "strength", label: "근력", desc: "악력계 측정", unit: "kg" },
    {
        key: "flexibility",
        label: "유연성",
        desc: "윗몸 앞으로 굽히기",
        unit: "cm",
    },
    { key: "agility", label: "민첩성", desc: "왕복 달리기", unit: "초" },
    { key: "balance", label: "평형성", desc: "외발서기 유지 시간", unit: "초" },
];

export default function MyFitMeasurePage() {
    const [form, setForm] = useState({
        sex: "",
        age: "",
        disability: "",
        results: {
            cardio: "",
            strength: "",
            flexibility: "",
            agility: "",
            balance: "",
        },
    });

    const handleSelectChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleResultChange = (key) => (e) => {
        setForm({
            ...form,
            results: { ...form.results, [key]: e.target.value },
        });
    };

    const handleReset = () => {
        setForm({
            sex: "",
            age: "",
            disability: "",
            results: {
                cardio: "",
                strength: "",
                flexibility: "",
                agility: "",
                balance: "",
            },
        });
    };

    const handleSubmit = () => {
        console.log("입력값:", form);
        alert("측정값이 저장되었습니다. (다음 단계: 처방 화면)");
        // 이후 단계: navigate("/prescription") 등으로 이동
    };

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <CenterTitle>체력 측정 입력</CenterTitle>

                {/* 안내 */}
                <Paper sx={{ p: 3, my: 2 }}>
                    <SubTitle>체력측정 안내</SubTitle>
                    <Contents100>
                        사용자 맞춤 운동 처방을 위해 체력 항목을 입력해주세요.
                        측정 항목은 연령대와 장애유형에 따라 달라질 수 있습니다.
                    </Contents100>
                </Paper>

                {/* 사용자 기본 정보 */}
                <Paper sx={{ p: 3, my: 2 }}>
                    <SubTitle>1. 기본 정보 입력</SubTitle>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {/* 성별 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="sex-label">성별</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    label="성별"
                                    value={form.sex}
                                    onChange={handleSelectChange("sex")}
                                    sx={{
                                        minWidth: "100%",
                                        height: 56, // 높이 맞춤
                                    }}
                                >
                                    <MenuItem value="M">남성</MenuItem>
                                    <MenuItem value="F">여성</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 연령대 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="age-label">연령대</InputLabel>
                                <Select
                                    labelId="age-label"
                                    label="연령대"
                                    value={form.age}
                                    onChange={handleSelectChange("age")}
                                    sx={{
                                        minWidth: "100%",
                                        height: 56,
                                    }}
                                >
                                    {[
                                        "10대",
                                        "20대",
                                        "30대",
                                        "40대",
                                        "50대",
                                        "60대 이상",
                                    ].map((age) => (
                                        <MenuItem key={age} value={age}>
                                            {age}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 장애 유형 */}
                        <Grid item xs={12} sm={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="dis-label">
                                    장애 유형
                                </InputLabel>
                                <Select
                                    labelId="dis-label"
                                    label="장애 유형"
                                    value={form.disability}
                                    onChange={handleSelectChange("disability")}
                                    sx={{
                                        minWidth: "100%",
                                        height: 56,
                                    }}
                                >
                                    {disabilityTypes.map((d) => (
                                        <MenuItem key={d} value={d}>
                                            {d}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* 측정 항목 입력 */}
                <Paper sx={{ p: 3, my: 2 }}>
                    <SubTitle>2. 측정 항목 입력</SubTitle>

                    {measureItems.map((item) => (
                        <Paper
                            key={item.key}
                            sx={{ p: 2, my: 1, backgroundColor: "#fafafa" }}
                        >
                            <SubTitle>{item.label}</SubTitle>
                            <Contents100 sx={{ mb: 1 }}>
                                {item.desc}
                            </Contents100>
                            <CustomTextField
                                label={`측정 결과 (${item.unit})`}
                                value={form.results[item.key]}
                                onChange={handleResultChange(item.key)}
                            />
                        </Paper>
                    ))}
                </Paper>

                {/* 버튼 */}
                <TwoAlignedButtons
                    containerSx={{ my: 3 }}
                    groupContainerSx={{ maxWidth: 400 }}
                    leftButton={{
                        children: "초기화",
                        variant: "outlined",
                        onClick: handleReset,
                    }}
                    rightButton={{
                        children: "결과 저장",
                        onClick: handleSubmit,
                    }}
                />
            </Container>
        </Layout>
    );
}
