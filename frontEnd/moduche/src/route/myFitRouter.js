import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const Measure = lazy(() => import("../pages/MyFit/MyFitMeasure"));
const Prescription = lazy(() => import("../pages/MyFit/MyFitPrescription"));
const PrescriptionBoard = lazy(() =>
    import("../pages/MyFit/MyFitPrescriptionBoard")
);
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
            path: "prescriptionBoard",
            element: (
                <Suspense fallback={Loading}>
                    <PrescriptionBoard />
                </Suspense>
            ),
        },
        {
            path: "recommend/:recommendId",
            element: (
                <Suspense fallback={Loading}>
                    <Recommend />
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
