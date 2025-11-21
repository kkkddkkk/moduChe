import { Grid, Typography } from "@mui/material";
import BannerApplyForm from "../../component/banner/BannerApplyForm";
import { CenterTitle } from "../../component/common/Text";

const BannerApplyPage = () => {
    return (
        <>
            <Grid size={3} />
            <Grid size={6}>
                <CenterTitle sx={{ mt:5, mb: 5}}>배너 등록 신청</CenterTitle>
                <BannerApplyForm />
            </Grid>
            <Grid size={3} />
        </>
    );
};

export default BannerApplyPage;
