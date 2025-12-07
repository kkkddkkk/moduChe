import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../component/common/Layout";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { IdCard, Landmark, User, UserRoundPlus, X } from "lucide-react";
import { CenterTitle } from "../../component/common/Text";
import {
  facilityList,
  individualList,
  MeunTemplate,
} from "../../component/myPage/MyPageMenuList";
import { getRoleFromToken } from "../../utils/auth";
import { getUserContext } from "../../context/UserContext";
import Paper from "../../component/common/Paper";
import Auth from "../Account/Auth";

const MyPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isNotMonitor = useMediaQuery(theme.breakpoints.down("md"));

  const listWidth = isNotMonitor ? 4 : 2;
  const DRAWER_WIDTH = !isNotMonitor ? "240px" : "80px";
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const role = getRoleFromToken(accessToken)?.toLowerCase();
  const { loggedIn } = getUserContext();

  const [title, setTitle] = useState("");
  const [roleKor, setRoleKor] = useState("");
  useEffect(() => {
    if (!loggedIn) navigate("/");
    role === "individual"
      ? setRoleKor("일반")
      : role === "facility"
      ? setRoleKor("시설")
      : setRoleKor("");
  }, []);

  // ✅ 메뉴 정의
  const MENU_ITEMS =
    role == "individual"
      ? individualList
      : role == "facility"
      ? facilityList
      : [];

  const currentKey = useMemo(() => {
    const found = MENU_ITEMS.find((item) =>
      location.pathname.startsWith(item.path)
    );
    setTitle(found.label);
    return found ? found.key : null;
  }, [location.pathname]);

  const isCoursePage =
    location.pathname.startsWith("/myPage/course") ||
    location.pathname.startsWith("/myPage/facility/course") ||
    currentKey === "course";

  return (
    <>
      <Auth />
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              pt: 1,
            },
          }}
          open
        >
          <Box sx={{ minHeight: 64, px: 2, fontWeight: 600 }}></Box>
          <List sx={{ py: 0 }}>
            <ListItemButton
              key={"role"}
              sx={{
                py: 1.1,
                mx: 1,
                mb: 0.5,
                cursor: "auto",
                "&:hover": {
                  backgroundColor: "transparent", // hover 시 배경색 없음
                },
                "&.Mui-selected": {
                  backgroundColor: "transparent", // selected 효과 없애려면
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "primary.main",
                }}
              >
                {role === "individual" ? (
                  <User />
                ) : role === "facility" ? (
                  <Landmark />
                ) : (
                  <X />
                )}
              </ListItemIcon>

              <ListItemText
                primary={`${roleKor}회원`}
                primaryTypographyProps={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
            <Divider />

            {MENU_ITEMS?.map((item) => {
              const selected = currentKey === item.key;
              return (
                <MeunTemplate
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                  selected={selected}
                />
              );
            })}
          </List>
        </Drawer>

        <Box sx={{ flexGrow: 1 }}>
          <Layout spacing={2}>
            {isMobile ? <></> : <Grid size={isCoursePage ? 1 : 3} />}
            <Grid
              size={isMobile ? 12 : isCoursePage ? 10 : 6}
              sx={{
                height: "100%",
                ...(isCoursePage && {
                  px: { xs: 2, md: 3 },
                  maxWidth: "1200px",
                  margin: "0 auto",
                }),
              }}
            >
              <CenterTitle>{title}</CenterTitle>
              <Outlet />
            </Grid>
            {isMobile ? <></> : <Grid size={isCoursePage ? 1 : 3} />}
          </Layout>
        </Box>
      </Box>
    </>
  );
};
export default MyPage;
