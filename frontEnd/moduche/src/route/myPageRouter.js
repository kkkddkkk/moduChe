import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const MyPage = lazy(() => import("../pages/MyPage/MyPage"));
const ManageAccount = lazy(() => import("../pages/MyPage/ManageAccount"));
const ManageDisability = lazy(() => import("../pages/MyPage/ManageDisability"));
const ManageFacility = lazy(() => import("../pages/MyPage/ManageFacility"));
const Test = lazy(() => import("../pages/MyPage/Test"));

const MyEnrolledCoursePage = lazy(() =>
  import("../pages/Course/MyEnrolledCoursePage")
);

const FacilityCourseManagePage = lazy(() =>
  import("../pages/Course/FacilityCourseManagePage")
);

const MyPageIndividual = lazy(() =>
  import("../component/account/MyPageIndividual")
);

const CommunityManagePage = lazy(() =>
  import("../pages/Community/CommunityManagePage")
);

const CommunityMemberPage = lazy(() =>
  import("../pages/Community/CommunityMemberPage")
);

export default function accoutRouter() {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
      children: [
        {
          path: "account",
          element: (
            <Suspense fallback={Loading}>
              <ManageAccount />
            </Suspense>
          ),
        },
        {
          path: "health",
          element: (
            <Suspense fallback={Loading}>
              <ManageDisability />
            </Suspense>
          ),
        },
        {
          path: "facility",
          element: (
            <Suspense fallback={Loading}>
              <ManageFacility />
            </Suspense>
          ),
        },
        {
          path: "communityI",
          element: (
            <Suspense fallback={Loading}>
              <CommunityMemberPage />
            </Suspense>
          ),
        },
        {
          path: "communityF",
          element: (
            <Suspense fallback={Loading}>
              <CommunityManagePage />
            </Suspense>
          ),
        },

        // ✅ 추가 1: /myPage/course → 내 수강 강좌
        {
          path: "course",
          element: (
            <Suspense fallback={Loading}>
              <MyEnrolledCoursePage />
            </Suspense>
          ),
        },

        // ✅ 추가 2: /myPage/facility/course → 시설 강좌 운영 관리
        {
          path: "facility/course",
          element: (
            <Suspense fallback={Loading}>
              <FacilityCourseManagePage />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "test",
      element: (
        <Suspense fallback={Loading}>
          <Test />
        </Suspense>
      ),
    },

    // 기존 구조 유지 (제거하지 않음)
    {
      path: "disability",
      element: (
        <Suspense fallback={Loading}>
          <MyPageIndividual />
        </Suspense>
      ),
    },
  ];
}
