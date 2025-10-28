import { useState } from "react";
import { Container, Grid, Toolbar } from "@mui/material";
import Layout from "../../component/common/Layout";
import {
    CenterTitle,
    Contents100,
    SubTitle,
} from "../../component/common/Text";
import CustomTextField from "../../component/common/CustomTextField";
import { TwoAlignedButtons } from "../../component/common/Button";
import { OutlinedSelect } from "../../component/common/CustomSelect";
import Paper from "../../component/common/Paper";

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

    const handleSelect = (field) => (newValue) => {
        setForm({ ...form, [field]: newValue });
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
    };

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <CenterTitle>체력 측정 입력</CenterTitle>

                <Paper>
                    <SubTitle>체력측정 안내</SubTitle>
                    <Contents100>
                        사용자 맞춤 운동 처방을 위해 체력 항목을 입력해주세요.
                        측정 항목은 연령대와 장애유형에 따라 달라질 수 있습니다.
                    </Contents100>
                </Paper>

                <Paper>
                    <SubTitle>1. 기본 정보 입력</SubTitle>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <OutlinedSelect
                                placeholder="성별"
                                data={["M", "F"]}
                                format={(d) => (d === "M" ? "남성" : "여성")}
                                selected={form.sex}
                                setSelected={handleSelect("sex")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <OutlinedSelect
                                placeholder="연령대"
                                data={[
                                    "10대",
                                    "20대",
                                    "30대",
                                    "40대",
                                    "50대",
                                    "60대 이상",
                                ]}
                                selected={form.age}
                                setSelected={handleSelect("age")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={4}>
                            <OutlinedSelect
                                placeholder="장애 유형"
                                data={disabilityTypes}
                                selected={form.disability}
                                setSelected={handleSelect("disability")}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper>
                    <SubTitle>2. 측정 항목 입력</SubTitle>

                    {measureItems.map((item) => (
                        <Paper
                            key={item.key}
                            padding={2}
                            sx={{ my: 1, mx: 0, backgroundColor: "#fafafa" }}
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
