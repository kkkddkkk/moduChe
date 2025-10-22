import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>
// const Login = lazy(() => import("../pages/Account/Login"));


export default function myFitRouter() {
    return [
        // {예시입니다. 참고해서 작성하시면 됩니다.
        //     path: "login",
        //     element: (
        //         <Suspense fallback={Loading}>
        //             <Login/>
        //         </Suspense>
        //     ),
        // }
    ]
}