import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ScrollShell } from '../component/common/ScrollToTop';
import testCommonRouter from './testCommonRouter';
import accountRouter from './accountRouter';
import courseRouter from './courseRouter';
import myFitRouter from './myFitRouter';
import adminRouter from './adminRouter';
import communityRouter from './communityRouter';

const Loading = <div>Loading...</div>;
const Main = lazy(() => import('../pages/Main/Main'));
const LayoutForAll = lazy(() => import('../pages/LayoutForAll'));
//root Router의 element는 LayoutForAll로 통일해도 될 것 같습니다~~(Main 제외 - 하위 페이지 없음.)
//이견 있으시면 말씀 주세용 -김도경-

const root = createBrowserRouter([
  {
    path: '/',
    element: <ScrollShell />, // ✅ 여기서 모든 자식 라우트에 대해 스크롤 맨 위 처리
    children: [
      {
        path: 'test',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: testCommonRouter(),
      },
      {
        path: '',
        element: (
          <Suspense fallback={Loading}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: 'account',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: accountRouter(),
      },
      {
        path: 'community',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: communityRouter(),
      },
      {
        path: 'course',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: courseRouter(),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: adminRouter(),
      },
      {
        path: 'myFit',
        element: (
          <Suspense fallback={Loading}>
            <LayoutForAll />
          </Suspense>
        ),
        children: myFitRouter(),
      },
    ],
  },
]);
export default root;
