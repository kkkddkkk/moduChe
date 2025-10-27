import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const Measure = lazy(() => import("../pages/MyFit/MyFitMeasure"));
const Prescription = lazy(() => import("../pages/MyFit/MyFitPrescription"));
const Recommend = lazy(() => import("../pages/MyFit/MyFitRecommend"));
const Content = lazy(() => import("../pages/MyFit/MyFitContent"));

export default function myFitRouter() {
    return [
        {
            path: "measure",
            element: (
                <Suspense fallback={Loading}>
                    <Measure />
                </Suspense>
            ),
        },
        {
            path: "prescription",
            element: (
                <Suspense fallback={Loading}>
                    <Prescription />
                </Suspense>
            ),
        },
        {
            path: "recommend",
            element: (
                <Suspense fallback={Loading}>
                    <Recommend />
                </Suspense>
            ),
        },
        {
            path: "content",
            element: (
                <Suspense fallback={Loading}>
                    <Content />
                </Suspense>
            ),
        },
    ];
}
