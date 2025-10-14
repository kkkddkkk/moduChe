import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import { Contents100 } from "../../component/common/Text";
import { API_SERVER_HOST, AUTH, MESSAGE } from "../../component/common/Variables";

const CommonVariables = () => {
    return (
        <Layout padding={2} space={3}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonVariables.js 문서입니다.</span><br />
                    <Contents100 bold>============== API_SERVER_HOST ==============</Contents100>
                    <Contents100>* API_SERVER_HOST = {API_SERVER_HOST}</Contents100>
                    <Contents100 bold>============== AUTH: 추후 추가예정 ==============</Contents100>
                    <Contents100>* AUTH.EXPIRE_WARNING_MINUTES = {AUTH.EXPIRE_WARNING_MINUTES}</Contents100>
                    <Contents100>* AUTH.HEADER_KEY = {AUTH.HEADER_KEY}</Contents100>
                    <Contents100>* AUTH.REFRESH_TOKEN_KEY = {AUTH.REFRESH_TOKEN_KEY}</Contents100>
                    <Contents100>* AUTH.SCHEME = {AUTH.SCHEME}</Contents100>
                    <Contents100>* AUTH.TOKEN_KEY = {AUTH.TOKEN_KEY}</Contents100>
                    <Contents100 bold>============== MESSAGE ==============</Contents100>
                    <Contents100>* MESSAGE.ERROR_FORBIDDEN = {MESSAGE.ERROR_FORBIDDEN}</Contents100>
                    <Contents100>* MESSAGE.ERROR_NETWORK = {MESSAGE.ERROR_NETWORK}</Contents100>
                    <Contents100>* MESSAGE.ERROR_UNAUTHORIZED = {MESSAGE.ERROR_UNAUTHORIZED}</Contents100>
                    <Contents100>* MESSAGE.ERROR_UNKNOWN = {MESSAGE.ERROR_UNKNOWN}</Contents100>
                    <Contents100>* MESSAGE.SUCCESS_DELETE = {MESSAGE.SUCCESS_DELETE}</Contents100>
                    <Contents100>* MESSAGE.SUCCESS_SAVE = {MESSAGE.SUCCESS_SAVE}</Contents100>
                </Box>
            </Grid>
        </Layout>
    );
}

export default CommonVariables;