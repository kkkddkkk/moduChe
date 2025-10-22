import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const CourseBoard = lazy(() => import("../pages/Course/CourseBoard"));
const CourseDetail = lazy(() => import("../pages/Course/CourseDetail"));
const ClubDetail = lazy(() => import("../pages/Club/ClubDetail"));



export default function testCommonRouter() {
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
            path: "CourseDtail",
            element: (
                <Suspense fallback={Loading}>
                    <CourseDetail/>
                </Suspense>
            ),
        }, 
         {
            path: "ClubDetail",
            element: (
                <Suspense fallback={Loading}>
                    <ClubDetail/>
                </Suspense>
            ),
        },
    ]
}