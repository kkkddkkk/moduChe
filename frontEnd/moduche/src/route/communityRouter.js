import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const Home = lazy(() => import("../pages/Community/CommunityHomePage"));
const Details = lazy(() => import("../pages/Community/CommunityDetailPage"));
const Register = lazy(() => import("../pages/Community/CommunityRegisterPage"));
const Manage = lazy(() => import("../pages/Community/CommunityManagePage"));


export default function communityRouter() {
    return [
        {
            path: "home",
            element: (
                <Suspense fallback={Loading}>
                    <Home />
                </Suspense>
            ),
        },
        {
            path: "details/:id",
            element: (
                <Suspense fallback={Loading}>
                    <Details />
                </Suspense>
            )
        },
        {
            path: "register",
            element: (
                <Suspense fallback={Loading}>
                    <Register />
                </Suspense>
            )
        },
        {
            path: "manage",
            element: (
                <Suspense fallback={Loading}>
                    <Manage />
                </Suspense>
            )
        }
    ]
}