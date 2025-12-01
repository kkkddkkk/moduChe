import React, { useMemo } from "react";
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
} from "@mui/material";

import InsightsIcon from "@mui/icons-material/Insights";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PaidIcon from "@mui/icons-material/Paid";
import ImageIcon from "@mui/icons-material/Image";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import CampaignIcon from "@mui/icons-material/Campaign";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

import { useNavigate, useLocation, Outlet } from "react-router-dom";

import Paper from "../../component/common/Paper";
import { CenterTitle, SmallerSubTitle } from "../../component/common/Text";

import { getRoleFromToken } from "../../utils/auth";

const DRAWER_WIDTH = 240;

const MENU_ITEMS = [
    {
        key: "dashboard",
        label: "대시보드",
        icon: <InsightsIcon />,
        path: "/admin/dashboard",
    },
    {
        key: "members",
        label: "회원 관리",
        icon: <PeopleAltIcon />,
        path: "/admin/members",
    },
    {
        key: "administrator",
        label: "관리자 계정",
        icon: <AdminPanelSettingsIcon />,
        path: "/admin/administrator",
    },
    {
        key: "calculate",
        label: "정산 내역",
        icon: <PaidIcon />,
        path: "/admin/calculate",
    },
    {
        key: "banners",
        label: "배너 관리",
        icon: <ImageIcon />,
        path: "/admin/banners",
    },
    {
        key: "facility",
        label: "시설 관리",
        icon: <BusinessIcon />,
        path: "/admin/facility",
    },
    {
        key: "club-approval",
        label: "동아리 승인",
        icon: <GroupsIcon />,
        path: "/admin/club-approval",
    },
    {
        key: "inquire",
        label: "문의/답변",
        icon: <HelpCenterIcon />,
        path: "/admin/inquire",
    },
    {
        key: "notices",
        label: "공지사항",
        icon: <CampaignIcon />,
        path: "/admin/notices",
    },
    {
        key: "reports",
        label: "신고 관리",
        icon: <ReportGmailerrorredIcon />,
        path: "/admin/reports",
    },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const role = getRoleFromToken(localStorage.getItem("accessToken"));
    const isSuperAdmin = role === "SUPER_ADMIN";

    const currentKey = useMemo(() => {
        const found = MENU_ITEMS.find((item) =>
            location.pathname.startsWith(item.path)
        );
        return found ? found.key : null;
    }, [location.pathname]);

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
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
                <Toolbar sx={{ minHeight: 64, px: 2, fontWeight: 600 }}>
                    관리자
                </Toolbar>

                <Divider />

                <List sx={{ py: 0 }}>
                    {MENU_ITEMS.map((item) => {
                        // 관리자 계정 메뉴는 SUPER_ADMIN만 표시
                        if (item.key === "administrator" && !isSuperAdmin) {
                            return null;
                        }

                        const selected = currentKey === item.key;

                        return (
                            <ListItemButton
                                key={item.key}
                                selected={selected}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    py: 1.1,
                                    borderRadius: 1.5,
                                    mx: 1,
                                    mb: 0.5,
                                    "&.Mui-selected": {
                                        backgroundColor: "primary.main",
                                        color: "primary.contrastText",
                                        "& .MuiSvgIcon-root": {
                                            color: "primary.contrastText",
                                        },
                                        "&:hover": {
                                            backgroundColor: "primary.main",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: selected
                                            ? "primary.contrastText"
                                            : "text.secondary",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.default",
                    overflow: "auto",
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
