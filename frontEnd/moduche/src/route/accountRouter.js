import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/Account/Login"));
const JoinUs = lazy(() => import("../pages/Account/JoinUs"));
const IndividualSignIn = lazy(() => import("../pages/Account/IndividualSignIn"));
const FacilitySignIn = lazy(() => import("../pages/Account/FacilitySignIn"));
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
            path: "signInI",
            element: (
                <Suspense fallback={Loading}>
                    <IndividualSignIn/>
                </Suspense>
            ),
        },{
            path: "signInF",
            element: (
                <Suspense fallback={Loading}>
                    <FacilitySignIn/>
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