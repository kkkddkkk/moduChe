// src/routers/inquiryRouter.js

import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;

const InquiryListPage = lazy(() => import("../pages/Inquiry/InquiryListPage"));
const InquiryWritePage = lazy(() =>
    import("../pages/Inquiry/InquiryWritePage")
);
// const InquiryDetailPage = lazy(() =>
//     import("../pages/Inquiry/InquiryDetailCard")
// );
const InquiryEditPage = lazy(() => import("../pages/Inquiry/InquiryEditPage"));

export default function inquiryRouter() {
    return [
        {
            index: true, // /inquiry → /inquiry/list 로 이동
            element: <Navigate to="list" replace />,
        },
        {
            path: "list",
            element: (
                <Suspense fallback={Loading}>
                    <InquiryListPage />
                </Suspense>
            ),
        },
        {
            path: "new",
            element: (
                <Suspense fallback={Loading}>
                    <InquiryWritePage />
                </Suspense>
            ),
        },
        // {
        //     path: ":id",
        //     element: (
        //         <Suspense fallback={Loading}>
        //             <InquiryDetailPage />
        //         </Suspense>
        //     ),
        // },
        {
            path: ":id/edit",
            element: (
                <Suspense fallback={Loading}>
                    <InquiryEditPage />
                </Suspense>
            ),
        },
    ];
}
