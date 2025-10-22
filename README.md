# moduChe

#루시트 아이콘 add 

yarn add lucide-react

현재 추가되어 있는 라이브러리

-tailwindcss
    정의: 유틸리티 클래스 기반 CSS 프레임워크. px-4, rounded-xl, grid, bg-emerald-600 같은 작은 클래스들을 조합해서 스타일을 만든다.

    -장점/사용처

    디자인 시스템 빠르게 조립, 커스텀 자유도 ↑

    파일 크기 최적화(purge)로 빌드 결과 작음

    React/MUI 등 어떤 UI 라이브러리와도 공존 가능

    yarn add -D tailwindcss@3.4.14 postcss autoprefixer
    
    npx tailwindcss init -p
    

-typography

    정의: 문서/게시글/블로그 본문에 쓰기 좋은 prose 스타일을 제공하는 Tailwind 플러그인.

    -사용처

    “About”, “공지/블로그”, “FAQ 본문” 등 긴 텍스트 영역을 예쁘게 기본 스타일링할 때.

    yarn add -D @tailwindcss/typography@0.5.10

    #사용 예시 
    <article className="prose max-w-none">
    <h2>About the Course</h2>
    <p>내용...</p>
    </article>

-lucide-react

    정의: 가벼운 아이콘 전용 라이브러리(Feather 아이콘의 후속/확장). 아이콘만 제공, UI 컴포넌트는 없음.

    -사용처

    버튼/라벨 옆에 아이콘 살짝 넣어 가독성과 의미 강화

    Tailwind, MUI 등 어떤 UI와도 같이 사용

    -장점

    아이콘 심볼이 깔끔·통일, 트리셰이킹 잘 됨

    yarn add lucide-react

-mui

    정의: 구글 머티리얼 디자인 기반의 완성형 UI 컴포넌트 세트 (Button, AppBar, Drawer, Dialog, Grid…).

    -사용처

    폼/레이아웃/네비게이션/모달 등 상호작용 컴포넌트 전반이 필요할 때

    접근성/반응형/테마 시스템(다크모드, 팔레트)까지 통합해서 쓰고 싶을 때

    장점

    컴포넌트 다양, 접근성/키보드 네비 처리 ↑

    테마 커스터마이징 쉬움

    yarn add @mui/material @emotion/react @emotion/styled
    # (아이콘 필요시)
    yarn add @mui/icons-material
