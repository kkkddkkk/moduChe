import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ScrollShell } from "../component/common/ScrollToTop";
import testCommonRouter from "./testCommonRouter";
import accountRouter from "./accountRouter";

const Loading = <div>Loading...</div>
const Test = lazy(() => import("../pages/Test/CommonMain"));
const Main = lazy(() => import("../pages/Main"));
const Account = lazy(() => import("../pages/Account/AccountLayout"));

const root = createBrowserRouter([
    {
        path: "/",
        element: <ScrollShell />,          // ✅ 여기서 모든 자식 라우트에 대해 스크롤 맨 위 처리
        children: [
            {
                path: "test",
                element: (
                    <Suspense fallback={Loading}>
                        <Test></Test>
                    </Suspense>
                ),
                children: testCommonRouter()
            },
            {
                path: "",
                element: (
                    <Suspense fallback={Loading}>
                        <Main></Main>
                    </Suspense>
                ),
            },
            {
                path: "account",
                element: (
                    <Suspense fallback={Loading}>
                        <Account/>
                    </Suspense>
                ),
                children: accountRouter()
            },
        ],
    },
]);
export default root;