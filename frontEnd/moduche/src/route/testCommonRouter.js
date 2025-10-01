import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
const CommonLayout = lazy(() => import("../pages/Test/CommonLayout"));
export default function testCommonRouter() {
    return [
        {
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    <CommonLayout></CommonLayout>
                </Suspense>
            ),
        }
    ]
}