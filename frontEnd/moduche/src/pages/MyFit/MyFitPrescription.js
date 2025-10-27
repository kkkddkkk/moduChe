import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    Divider,
} from "@mui/material";
import Layout from "../../component/common/Layout";
import {
    CenterTitle,
    Contents100,
    SubTitle,
} from "../../component/common/Text";
import { TwoAlignedButtons } from "../../component/common/Button";

import prescriptionData from "../MyFit/KS_DSPSN_FTNESS_MESURE_ACCTO_MVM_PRSCRPTN_LIST_202504.json";

export default function MyFitPrescriptionMock() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        sex: "",
        age: "",
        disability: "",
    });

    useEffect(() => {
        setData(prescriptionData);
    }, []);

    //  백엔드 API 구현시 변경
    //  useEffect(() => {
    //      fetch("/api/prescription") // ← 백엔드 API
    //      .then((res) => res.json())
    //      .then(setData);
    //  }, []);

    const handleChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value });
    };

    // 필터 조건에 맞는 데이터 필터링
    const filteredData = data.filter((item) => {
        const sexMatch = filters.sex
            ? item.SEXDSTN_FLAG_CD === filters.sex
            : true;
        const ageMatch = filters.age ? item.AGE_FLAG_NM === filters.age : true;
        const disMatch = filters.disability
            ? item.TROBL_TY_NM === filters.disability
            : true;
        return sexMatch && ageMatch && disMatch;
    });

    // 운동처방 텍스트를 단계별로 분리하는 함수
    const parsePrescription = (text) => {
        if (!text) return [];
        const regex = /(사전운동|본운동|마무리운동)[:：]\s*([^\/]+)/g;
        const matches = [...text.matchAll(regex)];
        return matches.map((m) => ({
            step: m[1],
            content: m[2].trim(),
        }));
    };

    return (
        <Layout>
            <Toolbar />
            <Container maxWidth="md" sx={{ my: 3 }}>
                <CenterTitle>맞춤형 운동처방</CenterTitle>

                {/* 필터 영역 */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <SubTitle>검색 조건</SubTitle>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {/* 성별 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="filter-sex">성별</InputLabel>
                                <Select
                                    labelId="filter-sex"
                                    label="성별"
                                    value={filters.sex}
                                    onChange={handleChange("sex")}
                                    sx={{ height: 56 }}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    <MenuItem value="M">남성</MenuItem>
                                    <MenuItem value="F">여성</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 연령대 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="filter-age">연령대</InputLabel>
                                <Select
                                    labelId="filter-age"
                                    label="연령대"
                                    value={filters.age}
                                    onChange={handleChange("age")}
                                    sx={{ height: 56 }}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    {[
                                        ...new Set(
                                            data.map((d) => d.AGE_FLAG_NM)
                                        ),
                                    ].map((age) => (
                                        <MenuItem key={age} value={age}>
                                            {age}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 장애유형 */}
                        <Grid item xs={12} sm={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="filter-dis">
                                    장애유형
                                </InputLabel>
                                <Select
                                    labelId="filter-dis"
                                    label="장애유형"
                                    value={filters.disability}
                                    onChange={handleChange("disability")}
                                    sx={{ height: 56 }}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    {[
                                        ...new Set(
                                            data.map((d) => d.TROBL_TY_NM)
                                        ),
                                    ].map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* 결과 영역 */}
                {filteredData.length === 0 ? (
                    <Typography align="center" sx={{ mt: 5 }}>
                        조건에 맞는 처방 데이터가 없습니다.
                    </Typography>
                ) : (
                    filteredData.slice(0, 10).map((item, idx) => {
                        const steps = parsePrescription(item.MVM_PRSCRPTN_CN);
                        return (
                            <Paper key={idx} sx={{ p: 3, my: 2 }}>
                                <SubTitle>
                                    {item.TROBL_TY_NM} ({item.AGE_FLAG_NM},{" "}
                                    {item.SEXDSTN_FLAG_CD})
                                </SubTitle>

                                <Contents100
                                    sx={{ color: "text.secondary", mb: 1 }}
                                >
                                    장애상세: {item.TROBL_DETAIL_NM || " - "} /
                                    등급: {item.TROBL_GRAD_NM || " - "}
                                </Contents100>

                                <Divider sx={{ my: 1 }} />

                                {steps.length > 0 ? (
                                    steps.map((s, i) => (
                                        <Contents100 key={i}>
                                            <strong>{s.step}:</strong>{" "}
                                            {s.content}
                                        </Contents100>
                                    ))
                                ) : (
                                    <Contents100>
                                        운동처방 내용이 없습니다.
                                    </Contents100>
                                )}
                            </Paper>
                        );
                    })
                )}

                <TwoAlignedButtons
                    containerSx={{ my: 4 }}
                    groupContainerSx={{ maxWidth: 400 }}
                    leftButton={{ children: "초기화", variant: "outlined" }}
                    rightButton={{ children: "다시 검색" }}
                />
            </Container>
        </Layout>
    );
}
