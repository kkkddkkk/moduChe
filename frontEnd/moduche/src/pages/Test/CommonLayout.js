import { Grid } from "@mui/material";
import Layout from "../../component/common/Layout";

const CommonLayout = () => {
    return (
        <Layout space={2} padding={3}>
            <Grid size={12}>
                Layout입니다. 모든 페이지의 layout으로 쓸 수 있습니다.<br />
                space(요소 간 간격 - 지금은 2), padding(요소 내부 공백 - 지금은 3)을 지정할 수 있습니다.<br />
                내부에 Grid로 layout을 지정하는데, 내부Grid의 size 총합은 총 12가 되어야 합니다.<br />
                코드는 다음과 같습니다<br />
                &nbsp;Grid size={3} border={'1px solid black'}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;size 3입니다.<br />
                &nbsp;/Grid<br />

                예시<br />
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
                size의 총 합이 12를 초과할 경우, 자동으로 줄바꿈처리됩니다.
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