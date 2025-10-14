import { Box, Button, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import { useState } from "react";
import { OutlinedSelect, StandardSelect } from "../../component/common/CustomSelect";


const CommonSelect = () => {
    const data = ['data1', 'data2', 'data3'];
    const [selected, setSelected] = useState('');
    const [error, setError] = useState(false);
    return (
        <Layout space={2} padding={3}>
            <Grid size={12}>
                <Box>
                    - select 타입의 input <span style={{ fontWeight: "bold" }}>StandardSelect</span> 입니다. (props: padding, size, data, selected, setSelected, disabled, placeholder, disabled, error, helperText)<br />
                    - TextField와 마찬가지로 크게 달라진게 없습니다... 거슬리는 기본설정만 바꿨다고 보시면 됩니다.<br />
                    - 기본 크기는 가로 전체를 다 채우는 maxWidth입니다. 크기 조절이 필요할 경우 layout, grid 활용하셔서 크기 조절하시면 됩니다.<br />
                    - useState 선언이 필요합니다. (예시: {`const [selected, setSelected] = useState("");`})

                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - data(필수): select option에 속하는 데이터를 배열 형태로 지정(지금은 data)<br />
                    - selected, setSelected(필수): useState("") 사용(지금은 selected, setSelected)<br />
                    - disabled: boolean 값. true 시 input 비활성화됨.<br />
                    - error: boolean값: true 시 helperText 활성화됨.<br />
                    - helperText: error 시 안내 문구 적용됨.<br />
                    - size: fontSize를 숫자로 입력<br />
                    - placeholder, padding(지금은 4 줬어요): 설명 생략
                </Box>
            </Grid>
            <Grid size={12}>
                <Layout space={2}>
                    <Grid size={9}>
                        <StandardSelect
                            padding={10}
                            data={data}
                            selected={selected}
                            setSelected={setSelected}
                            placeholder={"placeholder props입니다."}
                            size={20}
                            error={error}
                            helperText={"helperText 입니다"}
                        />
                    </Grid>
                    <Grid size={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={(e) => setError(!error)}
                        >setError({String(!error)})</Button>
                    </Grid>
                </Layout>
            </Grid>
            <Box>
                <span style={{ fontWeight: "bold" }}>* pages/Test/CommonSelect.js 문서입니다.</span><br />
                - select 타입의 input <span style={{ fontWeight: "bold" }}>OutlinedSelect</span> 입니다. (props: padding, size, data, selected, setSelected, disabled, placeholder, disabled, error, helperText)<br />
                - StandardSelect와는 모양 뺴고 모든 기능이 동일합니다. 이에 설명 생략합니다.

                <br /><br />
            </Box>
            <Grid size={12}>
                <OutlinedSelect
                    padding={10}
                    data={data}
                    selected={selected}
                    setSelected={setSelected}
                    placeholder={"placeholder props입니다."}
                    size={20}
                    error={error}
                    helperText={"helperText 입니다"}
                />
            </Grid>
        </Layout>
    );
}

export default CommonSelect;