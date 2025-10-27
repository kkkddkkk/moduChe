// src/route/adminRouter.js
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;

// 공통 레이아웃
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout"));

// 개별 페이지들
const DashboardPage      = lazy(() => import("../pages/Admin/DashboardPage"));
const MembersPage        = lazy(() => import("../pages/Admin/MembersPage"));
const AdministratorPage  = lazy(() => import("../pages/Admin/AdministratorPage"));
const CalculatePage      = lazy(() => import("../pages/Admin/CalculatePage"));
const BannersPage        = lazy(() => import("../pages/Admin/BannersPage"));
// const FacilityPage       = lazy(() => import("../pages/Admin/FacilityPage"));
// const ClubApprovalPage   = lazy(() => import("../pages/Admin/ClubApprovalPage"));
// const InquirePage        = lazy(() => import("../pages/Admin/InquirePage"));
// const NoticesPage        = lazy(() => import("../pages/Admin/NoticesPage"));
// const ReportsPage        = lazy(() => import("../pages/Admin/ReportsPage"));

export default function adminRouter() {
    return [
        {
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    <AdminLayout />
                </Suspense>
            ),
            children: [
                // /admin -> /admin/dashboard
                { index: true, element: <Navigate to="dashboard" replace /> },

                // (옛날 /admin/main -> dashboard)
                { path: "main", element: <Navigate to="../dashboard" replace /> },

                // 관리자 메인(대시보드)
                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={Loading}>
                            <DashboardPage />
                        </Suspense>
                    ),
                },

                // 1. 회원 관리
                {
                    path: "members",
                    element: (
                        <Suspense fallback={Loading}>
                            <MembersPage />
                        </Suspense>
                    ),
                },

                // 1-b. 관리자 계정
                {
                    path: "administrator",
                    element: (
                        <Suspense fallback={Loading}>
                            <AdministratorPage />
                        </Suspense>
                    ),
                },

                // 2. 정산 내역
                {
                    path: "calculate",
                    element: (
                        <Suspense fallback={Loading}>
                            <CalculatePage />
                        </Suspense>
                    ),
                },

                // 3. 배너
                {
                    path: "banners",
                    element: (
                        <Suspense fallback={Loading}>
                            <BannersPage />
                        </Suspense>
                    ),
                },

                // // 4. 시설 관리
                // {
                //     path: "facility",
                //     element: (
                //         <Suspense fallback={Loading}>
                //             <FacilityPage />
                //         </Suspense>
                //     ),
                // },

                // // 5. 동호회 승인/거절
                // {
                //     path: "club-approval",
                //     element: (
                //         <Suspense fallback={Loading}>
                //             <ClubApprovalPage />
                //         </Suspense>
                //     ),
                // },

                // // 6. 문의/답변
                // {
                //     path: "inquire",
                //     element: (
                //         <Suspense fallback={Loading}>
                //             <InquirePage />
                //         </Suspense>
                //     ),
                // },

                // // 7. 공지사항
                // {
                //     path: "notices",
                //     element: (
                //         <Suspense fallback={Loading}>
                //             <NoticesPage />
                //         </Suspense>
                //     ),
                // },

                // // 8. 신고 관리
                // {
                //     path: "reports",
                //     element: (
                //         <Suspense fallback={Loading}>
                //             <ReportsPage />
                //         </Suspense>
                //     ),
                // },
            ],
        },
    ];
}
