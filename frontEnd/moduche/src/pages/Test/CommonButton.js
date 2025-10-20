import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import { OneAlignedButton, TwoAlignedButtons } from "../../component/common/Button";

const CommonButton = () => {
    const handleClick = (label) => {
        alert(`${label} 버튼을 클릭했습니다.`);
    };

    return (
        <Layout>
            {/* 소개 및 props 설명 */}
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <br />
                    - 이 컴포넌트는 버튼의 <b>정렬</b>, <b>기본 스타일</b>, <b>크기</b>를 간단히 지정할 수 있고,
                    단일 버튼 또는 두 개 버튼 레이아웃을 빠르게 구성할 수 있도록 만들었습니다.
                    <br />
                    <br />
                    <span style={{ fontWeight: "bold" }}>** OneAlignedButton props (단일 버튼)</span>
                    <br />
                    - align: 'left' | 'center' | 'right' (기본: center). 버튼 컨테이너의 가로 정렬.
                    <br />
                    - size: 'small' | 'medium' | 'large' (기본: medium).
                    <br />
                    - inline: true면 inline-flex로 동작하여 <u>한 줄에 여러 버튼</u> 배치 가능.
                    <br />
                    - buttonWrapperSx: <u>버튼을 감싸는 컨테이너(Box)</u>의 스타일(폭/최소폭/반응형).
                    <br />
                    - buttonSx: 버튼 자체의 세밀한 스타일(px/py 등).
                    <br />
                    - containerSx: 바깥 Box의 스타일. <i>(기본은 width:"100%"라서 같은 줄 배치는 필요 시 여기서 width:"auto"로 덮어쓰기)</i>
                    <br />
                    - 그 외 MUI Button의 props(variant/color/sx/onClick 등) 사용 가능.
                    <br />
                    <br />
                    <span style={{ fontWeight: "bold" }}>** TwoAlignedButtons props (두 개 버튼)</span>
                    <br />
                    - align: 'left' | 'center' | 'right' | 'space-between' (기본: center). 그룹 컨테이너의 정렬.
                    <br />
                    - gap: 버튼 간격. 숫자는 theme.spacing, 문자열은 CSS 값(기본: 2 ≈ 16px).
                    <br />
                    - equalWidth: true면 두 버튼에 flex:1을 주어 같은 너비로.
                    <br />
                    - groupContainerSx: <u>두 버튼을 함께 감싸는 단일 컨테이너(Box)</u>의 스타일(폭/최소폭/반응형).
                    <br />
                    - leftButton / rightButton: 각 버튼의 개별 props(children, color, variant, size, sx 등).
                    <br />
                    - defaults: 두 버튼의 공통 기본값(variant, color, size, buttonSx) 지정 후 개별 props에서 덮어쓰기.
                </Box>
            </Grid>

            {/* 단일 버튼 예시들 */}
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <OneAlignedButton onClick={() => handleClick("기본(center)")}>
                        기본(center) 단일 버튼
                    </OneAlignedButton>
                </Box>
            </Grid>

            {/* 한 줄에 나란히 배치 (inline=true) */}
            <Grid size={12}>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    <OneAlignedButton
                        inline
                        // 부모(Box)에서 가로 중앙, 자식(버튼 컨테이너)은 가변폭 → 같은 줄 배치
                        containerSx={{ width: "auto" }}
                        buttonWrapperSx={{ width: 160, mr: 2 }}
                        onClick={() => handleClick("첫 번째(Inline)")}
                        align="center"
                    >
                        첫 번째(Inline)
                    </OneAlignedButton>

                    <OneAlignedButton
                        inline
                        containerSx={{ width: "auto" }}
                        color="secondary"
                        buttonWrapperSx={{ width: 160 }}
                        onClick={() => handleClick("두 번째(Inline)")}
                    >
                        두 번째(Inline)
                    </OneAlignedButton>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <OneAlignedButton
                        align="left"
                        size="large"
                        // 컨테이너에서 폭 지정, 버튼은 width:100%로 채움
                        buttonWrapperSx={{ width: 240 }}
                        buttonSx={{ px: 4, py: 1.5 }}
                        color="secondary"
                        onClick={() => handleClick("왼쪽 큰 버튼")}
                    >
                        왼쪽 큰 버튼
                    </OneAlignedButton>
                </Box>
            </Grid>

            {/* 두 개 버튼 예시들 — 단일 그룹 컨테이너 버전 */}
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <TwoAlignedButtons
                        align="right"
                        // align 생략 → 기본 center
                        // gap={24}
                        // 두 버튼을 감싸는 단일 컨테이너에서 폭/반응형 제어
                        groupContainerSx={{

                            width: { xs: "100%", sm: 460 },
                            justifyContent: "flex-end",
                        }}
                        leftButton={{
                            children: "취소",
                            variant: "outlined",
                            color: "inherit",
                            onClick: () => handleClick("취소"),
                        }}
                        rightButton={{
                            children: "저장",
                            color: "primary",
                            onClick: () => handleClick("저장"),
                        }}
                    />
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2, width: 700 }}>
                    <TwoAlignedButtons
                        align="right"
                        gap={1} // theme.spacing(1) ≈ 8px
                        defaults={{ size: "medium" }}
                        // 개별 버튼 최소폭은 각 버튼의 sx로 지정
                        leftButton={{
                            children: "뒤로",
                            // sx: { minWidth: 140 },
                            onClick: () => handleClick("뒤로"),
                        }}
                        rightButton={{
                            children: "다음",
                            color: "success",
                            // sx: { minWidth: 160 },
                            onClick: () => handleClick("다음"),
                        }}
                        groupContainerSx={{ width: { xs: "100%", sm: 360 } }}
                    />
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    <TwoAlignedButtons
                        // align="space-between"
                        equalWidth
                        defaults={{ size: "large" }}
                        // equalWidth일 때는 그룹 컨테이너 폭만 잡아주면 두 버튼이 flex:1로 균등 분배
                        groupContainerSx={{ width: "100%", maxWidth: 520 }}
                        leftButton={{ children: "이전", onClick: () => handleClick("이전") }}
                        rightButton={{
                            children: "제출",
                            variant: "contained",
                            onClick: () => handleClick("제출"),
                        }}
                    />
                </Box>
            </Grid>
        </Layout>
    );
};

export default CommonButton;
