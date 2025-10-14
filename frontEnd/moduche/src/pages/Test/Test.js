import { Button, Grid, Typography } from "@mui/material";
import Layout from "../../component/common/Layout";
import { useNavigate } from "react-router-dom";

const Test = () => {
    const navigate = useNavigate();
    const TestButton = ({ item }) => {
        return (
            <Grid size={3}>
                <Button variant="contained" onClick={() => navigate(`/test/${item}`)} >
                    {item} 문서 바로가기
                </Button>
            </Grid>

        );
    }
    return (
        <Layout padding={20} space={2}>
            <Grid size={12} marginBottom={"5%"}>
                <Typography variant="h4" textAlign={"center"} fontWeight={"bold"}>
                    버튼을 눌러 해당 문서로 이동할 수 있습니다.
                </Typography>
            </Grid>
            <TestButton item={"layout"} />
            <TestButton item={"table"} />
            <TestButton item={"textField"} />
            <TestButton item={"loading"} />
            <TestButton item={"modals"} />
            <TestButton item={"paper"} />
            <TestButton item={"theme"} />
            <TestButton item={"button"} />
            <TestButton item={"select"} />
            <TestButton item={"text"} />
        </Layout>
    );
}

export default Test;