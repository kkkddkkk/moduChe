import { lazy, Suspense } from "react";
import CommonTheme from "../pages/Test/CommonTheme";
import CommonButtonDemo from "../pages/Test/CommonButton";
import CommonButton from "../pages/Test/CommonButton";

const Loading = <div>Loading...</div>
const Test = lazy(() => import("../pages/Test/Test"));
const CommonLayout = lazy(() => import("../pages/Test/CommonLayout"));
const CommonTable = lazy(() => import("../pages/Test/CommonTable"));
const CommonTextField = lazy(() => import("../pages/Test/CommonTextField"));
const CommonLoading = lazy(() => import("../pages/Test/CommonLoading"));
const CommonModals = lazy(() => import("../pages/Test/CommonModals"));
const CommonPaper = lazy(() => import("../pages/Test/CommonPaper"));

export default function testCommonRouter() {
    return [
        {
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    <Test></Test>
                </Suspense>
            ),
        }, {
            path: "layout",
            element: (
                <Suspense fallback={Loading}>
                    <CommonLayout></CommonLayout>
                </Suspense>
            ),
        }, {
            path: "table",
            element: (
                <Suspense fallback={Loading}>
                    <CommonTable></CommonTable>
                </Suspense>
            ),
        }, {
            path: "textField",
            element: (
                <Suspense fallback={Loading}>
                    <CommonTextField></CommonTextField>
                </Suspense>
            ),
        }, {
            path: "loading",
            element: (
                <Suspense fallback={Loading}>
                    <CommonLoading></CommonLoading>
                </Suspense>
            ),
        }, {
            path: "modals",
            element: (
                <Suspense fallback={Loading}>
                    <CommonModals></CommonModals>
                </Suspense>
            ),
        }, {
            path: "paper",
            element: (
                <Suspense fallback={Loading}>
                    <CommonPaper></CommonPaper>
                </Suspense>
            ),
        },
        {
            path: "theme",
            element: (
                <Suspense fallback={Loading}>
                    <CommonTheme></CommonTheme>
                </Suspense>
            ),
        },
        {
            path: "button",
            element: (
                <Suspense fallback={Loading}>
                    <CommonButton></CommonButton>
                </Suspense>
            ),
        },
    ]
}