import { lazy, Suspense } from 'react';

const Loading = <div>Loading...</div>;
const Notice = lazy(() => import('../pages/Main/Notice'));
const ViewNotice = lazy(() => import('../pages/Main/ViewNotice'));

export default function noticeRouter() {
  return [
    {
      path: '',
      element: (
        <Suspense fallback={Loading}>
          <Notice />
        </Suspense>
      ),
    },
    {
      path: 'view/:noticeId',
      element: (
        <Suspense fallback={Loading}>
          <ViewNotice />
        </Suspense>
      ),
    },
  ];
}