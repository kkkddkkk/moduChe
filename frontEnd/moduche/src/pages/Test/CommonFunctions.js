import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import { Contents100 } from "../../component/common/Text";
import { dateFormat, dateToDay, numberFormat } from "../../component/common/Functions";
import Paper from "../../component/common/Paper";

const CommonVariables = () => {
    return (
        <Layout padding={2} space={3}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonFunctions.js 문서입니다.</span><br />
                    <Contents100 bold>============== numberFormat ==============</Contents100>
                    <Contents100> * 천 단위 숫자에서 , 추가</Contents100>
                    <Contents100> 예시: numberFormat(38000) = {numberFormat(38000)}</Contents100>
                    <Contents100 bold>============== dateFormat ==============</Contents100>
                    <Contents100> * 날짜를 0000-00-00 형태로 고정</Contents100>
                    <Contents100> 예시: dateFormat(new Date()) = {dateFormat(new Date())}</Contents100>
                    <Contents100 bold>============== dateToDay ==============</Contents100>
                    <Contents100> * 날짜에서 요일 추출</Contents100>
                    <Contents100> 예시: dateToDay(new Date()) = {dateToDay(new Date())}</Contents100>
                    <Contents100 bold>============== handleApiError ==============</Contents100>
                    <Contents100> * 디버깅용 에러 추출</Contents100>
                    <Contents100> 사용법:<br />
                        <Paper>
                            <pre>
                                {`try {
    const res = await axios.get("/api/users");
    return res.data;
} catch (err) {
    handleApiError(err);
}`}
                            </pre>
                        </Paper>

                    </Contents100>

                </Box>
            </Grid>
        </Layout>
    );
}

export default CommonVariables;