import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/Account/Login"));
const JoinUs = lazy(() => import("../pages/Account/JoinUs"));
const FindId = lazy(() => import("../pages/Account/FindId"));
const FindPw = lazy(() => import("../pages/Account/FindPw"));


export default function testCommonRouter() {
    return [
        {
            path: "login",
            element: (
                <Suspense fallback={Loading}>
                    <Login/>
                </Suspense>
            ),
        }, {
            path: "joinUs",
            element: (
                <Suspense fallback={Loading}>
                    <JoinUs/>
                </Suspense>
            ),
        }, {
            path: "findId",
            element: (
                <Suspense fallback={Loading}>
                    <FindId/>
                </Suspense>
            ),
        }, {
            path: "findPw",
            element: (
                <Suspense fallback={Loading}>
                    <FindPw/>
                </Suspense>
            ),
        },
    ]
}