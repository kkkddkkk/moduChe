import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/Account/Login"));
const JoinUs = lazy(() => import("../pages/Account/JoinUs"));
const SignIn = lazy(() => import("../pages/Account/SignIn"));
const FindId = lazy(() => import("../pages/Account/FindId"));
const FindPw = lazy(() => import("../pages/Account/FindPw"));


export default function accoutRouter() {
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
            path: "signIn",
            element: (
                <Suspense fallback={Loading}>
                    <SignIn/>
                </Suspense>
            ),
        },{
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