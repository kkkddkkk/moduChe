import { Grid } from '@mui/material';
import CommunityUserManage from '../../component/community/CommunityUserManage';
import Layout from '../../component/common/Layout';

const CommunityManagePage = () => {
  return (
    <Layout>
      <Grid size={12} sx={{ p: 2 }}>
        <CommunityUserManage />
      </Grid>
    </Layout>
  );
};

export default CommunityManagePage;
