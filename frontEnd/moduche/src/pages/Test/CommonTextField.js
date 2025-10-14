import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import CustomTextField from "../../component/common/CustomTextField";
import { useEffect, useState } from "react";

const CommonTextField = () => {
    const [textData, setTextData] = useState("");
    const [error, setError] = useState(false);
    useEffect(() => {
        setError(false);
        if (textData !== "help") return;
        setError(true);
    }, [textData])

    return (
        <Layout space={2} padding={3}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonTextField.js 문서입니다.</span><br />
                    - text 타입의 input <span style={{ fontWeight: "bold" }}>CustomTextField</span> 입니다. (props: padding, data, setData, disabled, placeholder, fontSize, error, helperText, rows)<br />
                    - 기존의 TextField와 크게 달라진게 없습니다... 거슬리는 기본설정만 바꿨다고 보시면 됩니다.<br />
                    - 기본 크기는 가로 전체를 다 채우는 maxWidth입니다. 크기 조절이 필요할 경우 layout, grid 활용하셔서 크기 조절하시면 됩니다.<br />
                    - useState 선언이 필요합니다. (예시: {`const [textData, setTextData] = useState("");`})

                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - data(필수): useState 사용(지금은 textData)<br />
                    - setData(필수): useState 사용(지금은 setTextData)<br />
                    - disabled: boolean 값. true 시 input 비활성화됨.<br />
                    - placeholder, padding(지금은 4 줬어요): 설명 생략<br />
                    - fontSize: fontSize를 숫자로 입력<br />
                    - error: boolean값: true 시 helperText 활성화됨.<br />
                    - helperText: error 시 안내 문구 적용됨.<br/>
                    -rows: 숫자로 입력. 여러 줄의 textInput으로 바꿀 수 있음.
                </Box>
            </Grid>
            <Grid size={12}>
                <CustomTextField
                    padding={4}
                    data={textData}
                    setData={setTextData}
                    placeholder={"placeholder 사용. size=12. label 사용, fontSize = 20"}
                    fontSize={20}
                />
            </Grid>
            <Grid size={6}>
                <CustomTextField
                    padding={4}
                    data={textData ? textData : "data 분기처리로 초기값 부여. size=6"}
                    setData={setTextData}
                />
            </Grid>
            <Grid size={4}>
                <CustomTextField
                    padding={4}
                    data={textData}
                    setData={setTextData}
                    disabled={true}
                    placeholder={"disable=true. size = 4"}
                />
            </Grid>
            <Grid size={2}>
                <CustomTextField
                    padding={4}
                    data={textData}
                    setData={setTextData}
                    placeholder={"size = 2"}
                />
            </Grid>
            <Grid size={6}>
                <Layout space={2}>
                    <Grid size={10}>
                        <CustomTextField
                            padding={4}
                            data={textData}
                            setData={setTextData}
                            placeholder={"layout 중첩 활용. size=6->layout->size=10"}
                        />
                    </Grid>
                </Layout>
            </Grid>
            <Grid size={6}>

                <CustomTextField
                    padding={4}
                    data={textData}
                    setData={setTextData}
                    placeholder={"helperText 적용(help 입력)"}
                    helperText={"helperText입니다."}
                    error={error}
                />

            </Grid>
            <Grid size={12}>

                <CustomTextField
                    padding={4}
                    data={textData}
                    setData={setTextData}
                    placeholder={"rows = 10"}
                    rows={10}
                />

            </Grid>
        </Layout>
    );
}

export default CommonTextField;