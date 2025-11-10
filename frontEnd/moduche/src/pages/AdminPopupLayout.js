import { Outlet } from "react-router-dom";

// 관리자 팝업 전용 레이아웃 (헤더·사이드바 없음)
export default function AdminPopupLayout() {
    return <Outlet />;
}
