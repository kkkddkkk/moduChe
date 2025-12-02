import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const CourseBoard = lazy(() => import("../pages/Course/CourseBoard"));
const CourseDetail = lazy(() => import("../pages/Course/CourseDetail"));
const CourseRegisterPage = lazy(() =>
  import("../pages/Course/CourseRegisterPage")
);

export default function courseRouter() {
  return [
    {
      index: true, // ✅ /course 접근 시 렌더
      element: (
        <Suspense fallback={Loading}>
          <CourseBoard />
        </Suspense>
      ),
    },

    {
      path: "details/:courseId",
      element: (
        <Suspense fallback={Loading}>
          <CourseDetail />
        </Suspense>
      ),
    },
    {
      path: "register",
      element: (
        <Suspense fallback={Loading}>
          <CourseRegisterPage />
        </Suspense>
      ),
    },
  ];
}
