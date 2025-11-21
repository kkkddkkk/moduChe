import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const ApplyPage = lazy(() => import("../pages/Banner/BannerApplyPage"));
const MyBannerPage = lazy(() => import("../pages/Banner/MyBannerPage"));

export default function bannerRouter() {
    return [
        {
            path: "apply",
            element: (
                <Suspense fallback={Loading}>
                    <ApplyPage />
                </Suspense>
            ),
        },
        {
            path: "my-banner",
            element: (
                <Suspense fallback={Loading}>
                    <MyBannerPage />
                </Suspense>
            ),
        }
    ];
}
