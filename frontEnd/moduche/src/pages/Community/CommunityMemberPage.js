import { Grid } from "@mui/material";
import CommunityUserManage from "../../component/community/CommunityUserManage";

const CommunityManagePage = () => {
    return (
        <Grid size={12} sx={{ p: 2 }}>
            <CommunityUserManage />
        </Grid>
    );
};

export default CommunityManagePage;
