import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import RequireRole from "../component/auth/RequireRole";

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
const BannersPage = lazy(() => import("../pages/Admin/BannerOnPage"));
const BannersApplyPage = lazy(() => import("../pages/Admin/BannersApplyPage"));
const FacilityPage = lazy(() => import("../pages/Admin/FacilityPage"));
const NoticePage = lazy(() => import("../pages/Admin/NoticePage"));
const ClubApproval = lazy(() => import("../pages/Admin/ClubApproval"));
const InquiryPage = lazy(() => import("../pages/Admin/InquiryPage"));
const ReportPage = lazy(() => import("../pages/Admin/ReportPage"));

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
                        <RequireRole role="SUPER_ADMIN">
                            <Suspense fallback={Loading}>
                                <AdministratorPage />
                            </Suspense>
                        </RequireRole>
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
                {
                    path: "notices",
                    element: (
                        <Suspense fallback={Loading}>
                            <NoticePage />
                        </Suspense>
                    ),
                },
                {
                    path: "club-approval",
                    element: (
                        <Suspense fallback={Loading}>
                            <ClubApproval />
                        </Suspense>
                    ),
                },
                {
                    path: "inquire",
                    element: (
                        <Suspense fallback={Loading}>
                            <InquiryPage />
                        </Suspense>
                    ),
                },
                {
                    path: "reports",
                    element: (
                        <Suspense fallback={Loading}>
                            <ReportPage />
                        </Suspense>
                    ),
                },
            ],
        },
    ];
}
