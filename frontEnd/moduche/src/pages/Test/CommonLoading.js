import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import Loading from "../../component/common/Loading";

const CommonLoading = () => {
    return (
        <Layout>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonLoading.js 문서입니다.</span><br />
                    - 로딩 중 추가 데이터 입력을 방지하는 <span style={{ fontWeight: "bold" }}>Loading</span> 입니다. (props: open, text)
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - open(필수): boolean 값. true인 동안 로딩화면이 지속됩니다. 지금은 그냥 true로 해놨습니다.(무한으로 돌아간다는 소리)<br />
                    - text: 로딩 중 화면에 띄우는 text입니다.<br />
                </Box>
            </Grid>
            <Loading
                open={true}
                text="로딩 중 화면에 띄우는 text입니다. 여긴 더 볼 것이 따로 없으니 다 읽었으면 알아서 나가십시오..."
            />
        </Layout>
    );
}

export default CommonLoading;