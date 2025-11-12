import { lazy, Suspense } from 'react';

const Loading = <div>Loading...</div>;
const MyPage = lazy(() => import('../pages/MyPage/MyPage'));
const ManageAccount = lazy(() => import('../pages/MyPage/ManageAccount'));
const ManageDisability = lazy(() => import('../pages/MyPage/ManageDisability'));

const MyPageIndividual = lazy(() =>
  import('../component/account/MyPageIndividual'),
);

export default function accoutRouter() {
  return [
    {
      path: '',
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
      children: [
        {
          path: 'account',
          element: (
            <Suspense fallback={Loading}>
              <ManageAccount />
            </Suspense>
          ),
        },
        {
          path: 'health',
          element: (
            <Suspense fallback={Loading}>
              <ManageDisability />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'account',
      element: (
        <Suspense fallback={Loading}>
          <ManageAccount />
        </Suspense>
      ),
    },
    {
      path: 'disability',
      element: (
        <Suspense fallback={Loading}>
          <MyPageIndividual />
        </Suspense>
      ),
    },
    {
      path: 'course',
      element: (
        <Suspense fallback={Loading}>
          <MyPageIndividual />
        </Suspense>
      ),
    },
    {
      path: 'community',
      element: (
        <Suspense fallback={Loading}>
          <MyPageIndividual />
        </Suspense>
      ),
    },
  ];
}
