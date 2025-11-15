import { lazy, Suspense } from 'react';

const Loading = <div>Loading...</div>;
const Login = lazy(() => import('../pages/Account/Login'));
const JoinUs = lazy(() => import('../pages/Account/JoinUs'));
const IndividualSignIn = lazy(() =>
  import('../pages/Account/IndividualSignIn'),
);
const FacilitySignIn = lazy(() => import('../pages/Account/FacilitySignIn'));
const FindAccount = lazy(() => import('../pages/Account/FindAccount'));
const MyPage = lazy(() => import('../pages/MyPage/MyPage'));
const Auth = lazy(() => import('../pages/Account/Auth'));

const FindId = lazy(() => import('../component/account/FindId'));
const FindPw = lazy(() => import('../component/account/FindPw'));

const MyPageIndividual = lazy(() =>
  import('../component/account/MyPageIndividual'),
);
const MyPageFacility = lazy(() =>
  import('../component/account/MyPageFacility'),
);

export default function accoutRouter() {
  return [
    {
      path: 'login',
      element: (
        <Suspense fallback={Loading}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: 'joinUs',
      element: (
        <Suspense fallback={Loading}>
          <JoinUs />
        </Suspense>
      ),
    },
    {
      path: 'signInI',
      element: (
        <Suspense fallback={Loading}>
          <IndividualSignIn />
        </Suspense>
      ),
    },
    {
      path: 'signInF',
      element: (
        <Suspense fallback={Loading}>
          <FacilitySignIn />
        </Suspense>
      ),
    },
    {
      path: 'find',
      element: (
        <Suspense fallback={Loading}>
          <FindAccount />
        </Suspense>
      ),
      children: [
        {
          path: 'id',
          element: <FindId />,
        },
        {
          path: 'pw',
          element: <FindPw />,
        },
      ],
    },
    {
      path: 'auth',
      element: (
        <Suspense fallback={Loading}>
          <Auth />
        </Suspense>
      ),
    },
  ];
}