import Layout from "../../component/common/Layout";
import { Toolbar, Typography, Grid, Stack, Box } from "@mui/material";
import Paper from "../../component/common/Paper";
import { OneAlignedButton } from "../../component/common/Button"
import { MapPin } from "lucide-react";
import DetailShell from "../../component/detail/DetailShell"
export default function ClubDetail() {
  const sidebar = (
    <Paper sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Join Navi Athletics Club
      </Typography>
      <OneAlignedButton size="large" fullWidth>
        클럽 가입
      </OneAlignedButton>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        가입 시 이벤트 소식을 받아볼 수 있습니다.
      </Typography>
    </Paper>
  );

  return (
    <Layout>
      <Toolbar />
      <Grid container>
        <Grid item xs={12}>
          <DetailShell
            cover="https://images.unsplash.com/photo-1521417531039-109ed1f3d0f2?q=80&w=1200&auto=format&fit=crop"
            title="Navi Athletics Club"
            subtitle="We move better together"
            byline={<span>Seoul • Community since 2018</span>}
            modeLabel="커뮤니티"
            location="Gangnam, Seoul"
            tags={["러닝", "필라테스", "크로스 트레이닝"]}
            sidebar={sidebar}
          >
            <Paper component="article" className="prose max-w-none">
              <h2>About the Club</h2>
              <p>We host weekly runs and cross-training sessions open to all levels.</p>
            </Paper>
          </DetailShell>
        </Grid>
      </Grid>
    </Layout>
  );
}