import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import Paper from "../../component/common/Paper";

const CommonLayout = () => {
    return (
        <Layout space={2} padding={3}>
            <Grid size={12} height={'150vh'}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonLayout.js 문서입니다.</span><br />
                    - 모든 페이지의 토대가 되는 <span style={{ fontWeight: "bold" }}>Layout</span> 입니다. (props: space, padding, outer)<br />
                    - 내부에 Grid로 layout을 지정하는데, 내부Grid의 size 총합은 총 12가 되어야 합니다.<br />
                    - 중첩도 가능합니다! 즉, 내부에서 컨테이너처럼 활용할 수도 있습니다.
                    <br />
                    layout 내부 코드 예시: <br />
                    {`<Grid size={3} border={'1px solid black'}>size 3입니다.</Grid>`}
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - space: 요소 간 간격(지금은 2(=8px)). %, px 등 다양한 단위 사용 가능<br />
                    - padding: 요소 내부 공백(지금은 3(=12px)). %, px 등 다양한 단위 사용 가능<br />
                    - outer: true 시 header, footer, ScrollTopButton 추가됨.(스크롤 내려보세요)(header, footer 추후 추가 예정)
                    <Paper>
                        <pre>
                            {`<Layout space={2} padding={3} outer>
                <Grid size={3} border={'1px solid black'}>
                size 3입니다.
            </Grid>
            <Grid size={6} border={'1px solid black'}>
                size 6입니다.
            </Grid>
            <Grid size={3} border={'1px solid black'}>
                size 3입니다.
            </Grid>
</Layout>`}
                        </pre>
                    </Paper>
                </Box>
            </Grid>


            <Grid size={3} border={'1px solid black'}>
                size 3입니다.
            </Grid>
            <Grid size={6} border={'1px solid black'}>
                size 6입니다.
            </Grid>
            <Grid size={3} border={'1px solid black'}>
                size 3입니다.
            </Grid>
            <Grid size={4} border={'1px solid black'}>
                size 4입니다.
            </Grid>
            <Grid size={2} border={'1px solid black'}>
                size 2입니다.
            </Grid>
            <Grid size={5} border={'1px solid black'}>
                size 5입니다.
            </Grid>
            <Grid size={1} border={'1px solid black'}>
                size 1입니다.
            </Grid>
            <Grid size={12} border={'1px solid black'}>
                size 12입니다.
            </Grid>
            <Grid size={12}>
                - size의 총 합이 12를 초과할 경우, 자동으로 줄바꿈처리됩니다.
            </Grid>
            <Grid size={7} border={'1px solid black'}>
                size 7입니다.
            </Grid>
            <Grid size={6} border={'1px solid black'}>
                size 6입니다.
            </Grid>
        </Layout>
    );
}

export default CommonLayout;