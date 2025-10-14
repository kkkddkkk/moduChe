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
                    - align: 'left' | 'center' | 'right' (기본: center). 버튼 컨테이너의 가로 정렬을 지정합니다.
                    <br />
                    - size: 'small' | 'medium' | 'large' (기본: medium). 버튼 크기를 지정합니다.
                    <br />
                    - buttonSx: 버튼 자체의 세밀한 스타일(px/py/minWidth 등)을 sx 형태로 덮어씁니다.
                    <br />
                    - containerSx: 바깥 Box에 여백, 최대폭 등 컨테이너 스타일을 부여합니다.
                    <br />
                    - variant/color/sx/onClick 등 MUI Button의 모든 props를 그대로 사용할 수 있습니다.
                    <br />
                    <br />
                    <span style={{ fontWeight: "bold" }}>** TwoAlignedButtons props (두 개 버튼)</span>
                    <br />
                    - align: 'left' | 'center' | 'right' | 'space-between' (기본: center). 두 버튼 묶음의 정렬입니다.
                    <br />
                    - gap: 버튼 사이 간격. 숫자는 theme.spacing, 문자열은 CSS 값 그대로 사용합니다. (기본: 2 ≈ 16px)
                    <br />
                    - equalWidth: true일 때 두 버튼을 같은 너비로 맞춥니다. (기본: false)
                    <br />
                    - minButtonWidth: 두 버튼의 최소 폭 지정(예: 120 또는 '140px').
                    <br />
                    - leftButton / rightButton: 각 버튼의 개별 props(children, color, variant, size, sx 등).
                    <br />
                    - defaults: 두 버튼의 공통 기본값(variant, color, size, buttonSx)을 한 번에 지정하고 개별 props에서 덮어쓸 수 있습니다.
                </Box>
            </Grid>

            {/* 단일 버튼 예시들 */}
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <OneAlignedButton onClick={() => handleClick("기본(center)")} >
                        기본(center) 단일 버튼
                    </OneAlignedButton>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <OneAlignedButton
                        align="right"
                        size="small"
                        buttonSx={{ minWidth: 120 }}
                        onClick={() => handleClick("오른쪽 작은 버튼")}
                    >
                        오른쪽 작은 버튼
                    </OneAlignedButton>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <OneAlignedButton
                        align="left"
                        size="large"
                        buttonSx={{ px: 4, py: 1.5 }}
                        color="secondary"
                        onClick={() => handleClick("왼쪽 큰 버튼")}
                    >
                        왼쪽 큰 버튼
                    </OneAlignedButton>
                </Box>
            </Grid>

            {/* 두 개 버튼 예시들 */}
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <TwoAlignedButtons
                        // align 생략 → 기본 center
                        gap={24}
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
                <Box sx={{ mb: 2 }}>
                    <TwoAlignedButtons
                        align="right"
                        gap={1} // theme.spacing(1) ≈ 8px
                        defaults={{ size: "medium" }}
                        leftButton={{ children: "뒤로", onClick: () => handleClick("뒤로") }}
                        rightButton={{ children: "다음", color: "success", onClick: () => handleClick("다음") }}
                    />
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <TwoAlignedButtons
                        align="space-between"
                        equalWidth
                        minButtonWidth={140}
                        defaults={{ size: "large" }}
                        leftButton={{ children: "이전", onClick: () => handleClick("이전") }}
                        rightButton={{ children: "제출", variant: "contained", onClick: () => handleClick("제출") }}
                    />
                </Box>
            </Grid>
        </Layout>
    );
};

export default CommonButton;
