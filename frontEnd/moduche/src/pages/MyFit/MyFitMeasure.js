import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { MyFitMeasureConfig } from "./MyFitMeasureConfig";

const disabilityTypes = Object.keys(MyFitMeasureConfig);
const ageGroups = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

export default function MyFitMeasurePage() {
    const [form, setForm] = useState({
        sex: "",
        age: "",
        disability: "",
        results: {},
    });

    const navigate = useNavigate();

    const handleSelect = (field) => (newValue) => {
        if (field === "disability") {
            const measures = MyFitMeasureConfig[newValue] || [];
            const newResults = Object.fromEntries(
                measures.map((m) => [m.key, { type: "", value: "" }])
            );
            setForm({ ...form, disability: newValue, results: newResults });
        } else {
            setForm({ ...form, [field]: newValue });
        }
    };

    const handleResultChange = (key, subfield) => (newValue) => {
        setForm((prev) => ({
            ...prev,
            results: {
                ...prev.results,
                [key]: { ...prev.results[key], [subfield]: newValue },
            },
        }));
    };

    const handleReset = () => {
        setForm({
            sex: "",
            age: "",
            disability: "",
            results: {},
        });
    };

    const handleSubmit = () => {
        navigate("/myfit/prescription", { state: { form } });
    };

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <CenterTitle>체력 측정 입력</CenterTitle>

                <Paper>
                    <SubTitle>1. 기본 정보 입력</SubTitle>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <OutlinedSelect
                                placeholder="성별"
                                data={["M", "F"]}
                                format={(d) => (d === "M" ? "남성" : "여성")}
                                selected={form.sex}
                                setSelected={handleSelect("sex")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <OutlinedSelect
                                placeholder="연령대"
                                data={ageGroups}
                                selected={form.age}
                                setSelected={handleSelect("age")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <OutlinedSelect
                                placeholder="장애 유형"
                                data={disabilityTypes}
                                selected={form.disability}
                                setSelected={handleSelect("disability")}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {form.disability && (
                    <Paper>
                        <SubTitle>2. 측정 항목 입력</SubTitle>

                        {MyFitMeasureConfig[form.disability].map((item) => (
                            <Paper
                                key={item.key}
                                sx={{ my: 1, p: 2, backgroundColor: "#fafafa" }}
                            >
                                <SubTitle>{item.label}</SubTitle>
                                <Contents100 sx={{ mb: 1 }}>
                                    [{item.category}] 항목입니다.
                                </Contents100>

                                <OutlinedSelect
                                    placeholder={`${item.label} 측정 방법`}
                                    data={item.options}
                                    selected={
                                        form.results[item.key]?.type || ""
                                    }
                                    setSelected={handleResultChange(
                                        item.key,
                                        "type"
                                    )}
                                />

                                <CustomTextField
                                    label={`측정 결과 (${item.unit})`}
                                    data={form.results[item.key]?.value || ""}
                                    setData={handleResultChange(
                                        item.key,
                                        "value"
                                    )}
                                    sx={{ mt: 2 }}
                                />
                            </Paper>
                        ))}
                    </Paper>
                )}

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
