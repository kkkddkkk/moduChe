import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ScrollShell } from "../component/common/ScrollToTop";
import testCommonRouter from "./testCommonRouter";

const Loading = <div>Loading...</div>
const CommonMain = lazy(() => import("../pages/Test/CommonMain"));

const root = createBrowserRouter([
    {
        path: "/",
        element: <ScrollShell />,          // ✅ 여기서 모든 자식 라우트에 대해 스크롤 맨 위 처리
        children: [
            {
                path: "test",
                element: (
                    <Suspense fallback={Loading}>
                        <CommonMain></CommonMain>
                    </Suspense>
                ),
                children: testCommonRouter()
            }
        ],
    },
]);
export default root;