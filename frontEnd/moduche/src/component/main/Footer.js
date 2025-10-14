import { Box, Grid, useTheme } from "@mui/material";
import { Contents100 } from "../common/Text";
import { MainBar, MainMenu, MainTextContainer } from "./mainComponents";
import Layout from "../common/Layout";

const Footer = () => {
    const theme = useTheme();
    const menuColor = theme.palette.background.default;

    const Link = ({ href, children }) => {
        return (
            <a
                href={href}
                target="_blank"        // 새 창에서 열기
                rel="noopener noreferrer" // 보안용
            >
                {children}
            </a>
        )
    }

    return (
        <Box
            component="footer"
            sx={{
                py: 3, // Padding top and bottom
                px: 2, // Padding left and right
                mt: 'auto', // Push to the bottom
                backgroundColor: theme.palette.text.secondary
            }}
        >
            <MainTextContainer margin={"2% 0"}>
                <Link href={"https://www.kspo.or.kr/kspo/privacy/privacyPolicy/privacy_policy.do?menuNo=200438"}>
                    <MainMenu menuColor={menuColor}>개인정보처리방침</MainMenu>
                </Link>
                <MainBar barColor={menuColor} />
                <Link href={"https://www.kspo.or.kr/kspo/main/contents.do?menuNo=200218"}>
                    <MainMenu menuColor={menuColor}>홈페이지저작권정책</MainMenu>
                </Link>

                <MainBar barColor={menuColor} />
                <Link href={"https://www.kspo.or.kr/kspo/main/contents.do?menuNo=200176"}>
                    <MainMenu menuColor={menuColor}>전화번호안내</MainMenu>
                </Link>
                <MainBar barColor={menuColor} />
                <Link href={"https://www.kspo.or.kr/kspo/main/contents.do?menuNo=200207"}>
                    <MainMenu menuColor={menuColor}>위치안내</MainMenu>
                </Link>
                <MainBar barColor={menuColor} />
                <Link href={""}>
                    <MainMenu menuColor={menuColor}>홈페이지이용안내</MainMenu>
                </Link>
                <MainBar barColor={menuColor} />
                <Link href={"https://www.kspo.or.kr/kspo/main/contents.do?menuNo=200360"}>
                    <MainMenu menuColor={menuColor}>읽기전용프로그램안내</MainMenu>
                </Link>
                <MainBar barColor={menuColor} />
                <Link href={""}>
                    <MainMenu menuColor={menuColor}>사이트맵</MainMenu>
                </Link>
            </MainTextContainer>
            <Layout>
                <Grid size={8}>

                    <Contents100 color={menuColor} margin="1% 0">
                        주소: 05540 서울시 송파구 올림픽로 424 올림픽회관
                    </Contents100>
                    <Contents100 color={menuColor} margin="1% 0">
                        전화번호: 02-410-1114
                    </Contents100>
                    <Contents100 color={menuColor} margin="1% 0">
                        팩스: 02-410-1219
                    </Contents100>
                    <Contents100 color={theme.palette.text.primary} margin="1% 0">
                        COPYRIGHT © 국민체육진흥공단.ALL RIGHT RESERVED
                    </Contents100>
                </Grid>
                <Grid size={4} justifyContent="flex-end" container padding={3} direction="column" >
                    <Link href={"https://www.kspo.or.kr/kspo/main/main.do"}>
                        <Box display={"flex"} justifyContent={"end"}>
                            <Box component={"img"}
                                src="/logo/KSPO_LOGO.png"
                                sx={{
                                    width: 150,
                                    height: "auto",
                                    display: "inline-block",
                                    cursor: "pointer"
                                }}
                            />
                        </Box>
                    </Link>
                </Grid>

            </Layout>

        </Box>
    )
}
export default Footer;