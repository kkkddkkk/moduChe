import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// 공통 레이아웃
const Loading = <div>Loading...</div>;
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout"));

// 개별 페이지들
const DashboardPage = lazy(() => import("../pages/Admin/DashboardPage"));
const MembersPage = lazy(() => import("../pages/Admin/MembersPage"));
const AdministratorPage = lazy(() =>
    import("../pages/Admin/AdministratorPage")
);
const CalculatePage = lazy(() => import("../pages/Admin/CalculatePage"));
const BannersPage = lazy(() => import("../pages/Admin/BannersPage"));
const BannersApplyPage = lazy(() => import("../pages/Admin/BannersApplyPage"));
const FacilityPage = lazy(() => import("../pages/Admin/FacilityPage"));

export default function adminRouter() {
    return [
        // 기존 Admin 레이아웃 트리
        {
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    <AdminLayout />
                </Suspense>
            ),
            children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                {
                    path: "main",
                    element: <Navigate to="../dashboard" replace />,
                },

                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={Loading}>
                            <DashboardPage />
                        </Suspense>
                    ),
                },
                {
                    path: "members",
                    element: (
                        <Suspense fallback={Loading}>
                            <MembersPage />
                        </Suspense>
                    ),
                },
                {
                    path: "administrator",
                    element: (
                        <Suspense fallback={Loading}>
                            <AdministratorPage />
                        </Suspense>
                    ),
                },
                {
                    path: "calculate",
                    element: (
                        <Suspense fallback={Loading}>
                            <CalculatePage />
                        </Suspense>
                    ),
                },
                {
                    path: "banners",
                    element: (
                        <Suspense fallback={Loading}>
                            <BannersPage />
                        </Suspense>
                    ),
                },
                {
                    path: "banners-apply",
                    element: (
                        <Suspense fallback={Loading}>
                            <BannersApplyPage />
                        </Suspense>
                    ),
                },
                {
                    path: "facility",
                    element: (
                        <Suspense fallback={Loading}>
                            <FacilityPage />
                        </Suspense>
                    ),
                },
            ],
        },
    ];
}
