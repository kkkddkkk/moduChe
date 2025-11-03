import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// 공통 레이아웃
const Loading = <div>Loading...</div>;
const AdminLayout       = lazy(() => import("../pages/Admin/AdminLayout"));

// 개별 페이지들
const DashboardPage     = lazy(() => import("../pages/Admin/DashboardPage"));
const MembersPage       = lazy(() => import("../pages/Admin/MembersPage"));
const AdministratorPage = lazy(() => import("../pages/Admin/AdministratorPage"));
const CalculatePage     = lazy(() => import("../pages/Admin/CalculatePage"));
const BannersPage       = lazy(() => import("../pages/Admin/BannersPage"));
const FacilityPage      = lazy(() => import("../pages/Admin/FacilityPage"));

// 팝업(새 창)에서 렌더될 생성 폼 페이지 (레이아웃 없이 단독)
const AdminCreateWindow = lazy(() => import("../pages/Admin/AdminCreateWindow"));

export default function adminRouter() {
  return [
    // 팝업 전용 라우트: AdminLayout 바깥에 둔다 (사이드바/헤더 제거)
    {
      path: "admins/new",
      element: (
        <Suspense fallback={Loading}>
          <AdminCreateWindow />
        </Suspense>
      ),
    },

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
        { path: "main", element: <Navigate to="../dashboard" replace /> },

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
