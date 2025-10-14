import { Box, Grid, Paper, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Layout from "../../component/common/Layout";

/** 밝은 배경이면 글자색을 어둡게 */
const isLight = (hex) => {
    if (!hex) return false;
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 180;
};

const ColorChip = ({ name, color }) => {
    const light = isLight(color);
    return (
        <Box
            sx={{
                width: 160,
                height: 72,
                borderRadius: 2,
                bgcolor: color || "transparent",
                boxShadow: light
                    ? "inset 0 0 0 1px rgba(0,0,0,0.12)"
                    : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: light ? "#111" : "#fff",
                fontWeight: 700,
                textAlign: "center",
            }}
        >
            <Box sx={{ fontSize: 12, opacity: 0.85, mb: 0.5 }}>{name}</Box>
            <Box sx={{ fontSize: 14 }}>{color?.toUpperCase?.() || "-"}</Box>
        </Box>
    );
};

const Row = ({ children }) => (
    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
        {children}
    </Stack>
);

const CommonTheme = () => {
    const theme = useTheme();
    const p = theme.palette;
    const c = theme.customColors || {};

    return (
        <Layout>
            <Grid size={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                    {/* Background 1/2/3 */}
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        • Background
                    </Typography>
                    <Row>
                        <ColorChip name="background1" color={p.background?.default} />
                        <ColorChip name="background2" color={p.background?.paper} />
                        <ColorChip name="background3" color={c.background3} />
                    </Row>

                    {/* Main 1/2 */}
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        • Main
                    </Typography>
                    <Row>
                        <ColorChip name="main1" color={p.primary?.main} />
                        <ColorChip name="main2" color={p.secondary?.main} />
                    </Row>

                    {/* Text 1/2 */}
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        • Text
                    </Typography>
                    <Row>
                        <ColorChip name="text1" color={p.text?.primary} />
                        <ColorChip name="text2" color={p.text?.secondary} />
                    </Row>

                    {/* Warning 1/2 */}
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        • Warning
                    </Typography>
                    <Row>
                        <ColorChip name="warning1" color={c.warning1} />
                        <ColorChip name="warning2" color={p.warning?.main} />
                    </Row>
                </Paper>
            </Grid>
        </Layout>
    );
};

export default CommonTheme;
