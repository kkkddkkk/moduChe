import { Calendar, Clock, MapPin } from "lucide-react";
import Chip from "./Chip";
import Stat from "./Stat";
import Layout from "../common/Layout";
import { Grid, Paper, Box, Typography, Stack } from "@mui/material";
import { styled } from '@mui/material/styles';
/**
* DetailShell
* 재사용 가능한 상세 페이지 레이아웃
*
* Props (필요한 것만 넘기세요):
* - cover (string) : 상단 좌측 이미지 URL
* - title (string) : 제목
* - subtitle (string) : 부제/슬로건 (선택)
* - byline (string | ReactNode) : 강사명/동호회명 등 (선택)
* - periodText (string) : 기간 문구 (선택)
* - cadenceText (string) : 반복/회차 문구 (선택)
* - modeLabel (string) : 대면/비대면/하이브리드 (선택)
* - location (string) : 장소 텍스트 (선택)
* - difficulty (string) : 난이도 (선택)
* - tags (string[]) : 접근성/태그 (선택)
* - headerExtras (ReactNode) : 상단 우측 박스 안 컨트롤(세션/날짜 드롭다운 등)
* - sidebar (ReactNode) : 우측 사이드바 전체 교체 (가격/CTA 등)
* - children (ReactNode) : 하단 본문(설명/FAQ/커리큘럼 등)
*/

const Background = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(to bottom right,`,
  color: theme.palette.grey[900],
}));

export default function DetailShell({
  cover,
  title,
  subtitle,
  byline,
  periodText,
  cadenceText,
  modeLabel,
  location,
  difficulty,
  tags,
  headerExtras,
  sidebar,
  children,
}) {
  return (
    <Background>
      <Box sx={{ maxWidth: '6xl', mx: 'auto', px: 4, py: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              <Grid container spacing={2} alignItems="stretch">
                {cover && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ overflow: 'hidden', height: '100%' }}>
                      <Box
                        component="img"
                        src={cover}
                        alt="cover"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Paper>
                  </Grid>
                )}
                <Grid item xs={12} md={cover ? 6 : 12}>
                  <Paper sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Stack spacing={1}>
                      {title && <Typography variant="h5" component="h1" fontWeight="bold" letterSpacing="-0.5px">{title}</Typography>}
                      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                      {byline && <Typography variant="body2" color="text.secondary">{byline}</Typography>}
                      <Stack direction="row" spacing={2} pt={1} flexWrap="wrap">
                      {periodText && <Stat icon={Calendar}>{periodText}</Stat>}
                      {cadenceText && <Stat icon={Clock}>{cadenceText}</Stat>}
                      </Stack>
                    </Stack>
                    {headerExtras && <Box pt={2}>{headerExtras}</Box>}
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {(modeLabel || location || difficulty) && (
                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                      {modeLabel && <Chip>{modeLabel}</Chip>}
                      {location && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <MapPin style={{ width: 16, height: 16 }} /> {location}
                        </Typography>
                      )}
                      {difficulty && <Chip>Difficulty: {difficulty}</Chip>}
                    </Stack>
                  )}

                  {Array.isArray(tags) && tags.length > 0 && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium" color="text.secondary" mb={1}>Tags</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {tags.map((t) => (
                          <Chip key={t}>{t}</Chip>
                        ))}
                      </Stack>
                    </Box>
                  )}
                  <Box className="prose max-w-none">{children}</Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              {sidebar ? (
                sidebar
              ) : (
                <Paper sx={{ p: 2.5, fontSize: '0.875rem', color: 'text.secondary' }}>
                  <Typography fontWeight="medium">No sidebar provided.</Typography>
                  <Typography variant="body2" mt={0.5}>
                    Pass a component via the <code>sidebar</code> prop.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Background>
  );
}