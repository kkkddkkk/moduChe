import { Box, Divider, Grid, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Contents } from "../common/Text";
import { SlideModal } from "../common/Modals";
import { useEffect, useRef, useState } from "react";
import CustomTextField from "../common/CustomTextField";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const headerRef = useRef(null);
    const [openSearch, setOpenSearch] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const menuColor = theme.palette.background.default;

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.clientHeight);
        }
    }, []);

    const moveTo = ({ item }) => {
        return () => navigate(`/account/${item}`)
    }

    const clickSearchButton = () => {
        setOpenSearch(!openSearch);
    }

    const HeaderMenu = ({ children, onClick }) => {
        return (
            <Contents color={menuColor} hover={true} onClick={onClick}>
                {children}
            </Contents>
        )
    }

    const MenuBar = () => {
        return <Divider orientation="vertical" flexItem sx={{ borderColor: menuColor }} />
    }

    const HeaderIcon = ({ children, onClick }) => {
        return (
            <IconButton size="large" edge="end" color="inherit"
                aria-label="menu" sx={{ mr: 2 }} onClick={onClick}>
                {children}
            </IconButton>
        )
    }

    return (
        <AppBar position="fixed" ref={headerRef} sx={{ zIndex: 1500 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    모두의 체육관 임시헤더
                </Typography>
                <HeaderMenu onClick={clickSearchButton}>검색하기</HeaderMenu>
                <HeaderIcon onClick={clickSearchButton}>
                    <SearchIcon />
                </HeaderIcon>
                <SlideModal position={"top"} open={openSearch} close={() => setOpenSearch(false)}
                    headerHeight={headerHeight || 0} title={"검색해보기~"}
                >
                    <Grid size={2} />
                    <Grid size={8}>
                        <CustomTextField
                            data={search}
                            setData={setSearch}
                            placeholder={"성남님 여기에 퀵서치 디자인해서 넣으시면 될듯요"}
                            padding={12}
                        />
                    </Grid>
                    <Grid size={2} />
                </SlideModal>

                {!isMdUp ?
                    <HeaderIcon> <MenuIcon /></HeaderIcon> :
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center", // 세로 가운데 정렬
                            gap: 1, // 항목 간 간격
                        }}
                    >
                        <HeaderMenu>로그인</HeaderMenu>
                        <MenuBar />
                        <HeaderMenu>회원가입</HeaderMenu>
                    </Box>
                }

            </Toolbar>
        </AppBar >
    )
}
export default Header;