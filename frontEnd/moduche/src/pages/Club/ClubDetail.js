import Layout from "../../component/common/Layout";
import { Toolbar, Typography, Grid, Stack, Box, Container } from "@mui/material";
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
      {/* 전체 컨텐츠를 감싸는 12컬럼 그리드 (1.5 : 9 : 1.5) */}
      <Grid container columns={12} sx={{ px: { xs: 2, lg: 3 }, py: 2 }}>
        {/* 좌측 배너 영역 (1.5) */}
        <Grid item lg={1.5} sx={{ display: { xs: "none", lg: "block" } }}>
          <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 24 }}>
            <Typography variant="caption" color="text.secondary">배너 광고</Typography>
          </Paper>
        </Grid>

        {/* 중앙 컨텐츠 영역 (9) */}
        <Grid item xs={12} lg={9}>
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

        {/* 우측 배너 영역 (1.5) */}
        <Grid item lg={1.5} sx={{ display: { xs: "none", lg: "block" } }}>
          <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 24 }}>
            <Typography variant="caption" color="text.secondary">배너 광고</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}