// pages/Test/CommonPaper.js
// 이 문서는 CommonLoading 페이지와 동일한 흐름으로 작성되었으며 먼저 이 페이지의 성격과 props 설명을 간단하고도 충분히 이해될 수 있도록 문장으로 안내하고, 이어서 실제 Paper 컴포넌트를 다양한 케이스로 렌더링하여 시각적으로 동작을 확인할 수 있게 구성했습니다.

import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import Paper from "../../component/common/Paper"; // 커스텀 Paper를 사용한다고 가정합니다.

const CommonPaper = () => {
    // 이 예시 페이지는 컨텐츠를 감싸는 컨테이너 역할을 하는 Paper 컴포넌트를 테스트하기 위한 용도로 작성되었으며, elevation과 padding으로 기본 스타일을 확인하고, hoverable과 onClick을 통해 상호작용 가능한 카드처럼 동작시키는 방법을 한눈에 보여주려는 목적을 가지고 있습니다.
    const handleClick = (label) => {
        alert(`${label} 박스를 클릭했습니다.`);
    };

    return (
        <Layout>
            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <span style={{ fontWeight: "bold" }}>
                        * pages/Test/CommonPaper.js 문서입니다.
                    </span>
                    <br />
                    - 이 컴포넌트는 컨텐츠를 담는 상자 역할을 하며 그림자, 여백, 모서리, 배경 등을 손쉽게 제어할 수 있도록 되어 있고, 필요한 경우 클릭과 호버 효과를 켜서 카드처럼 사용할 수 있습니다.
                    <br />
                    <br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span>
                    <br />
                    - elevation: 그림자의 깊이를 숫자로 지정하며 일반적으로 1에서 6 사이가 자연스럽고 기본값은 3으로 설정되어 있습니다.
                    <br />
                    - padding: 내부 여백을 간단한 단위로 지정하며 문자열이나 숫자를 그대로 전달해 컴포넌트 안쪽 간격을 손쉽게 조정할 수 있습니다.
                    <br />
                    - hoverable: 호버 시 그림자가 강조되고 살짝 떠오르는 애니메이션이 적용되도록 하는 불리언 옵션이며 마우스 오버에 반응하는 카드형 UI를 구현할 때 유용합니다.
                    <br />
                    - onClick: 클릭 이벤트 핸들러를 전달하면 커서가 자동으로 손가락 모양으로 바뀌고 호버 효과와 함께 클릭 가능한 카드로 동작하며, 전달하지 않으면 정적인 컨테이너로 사용됩니다.
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <Paper elevation={1} padding="1rem">
                        기본 사용 예시이며 낮은 그림자와 적당한 내부 여백을 통해 단정한 구획을 만들었습니다.
                    </Paper>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <Paper elevation={3} padding="1.5rem">
                        조금 더 강조된 그림자와 넉넉한 여백을 사용해 섹션 구분을 선명하게 보이도록 구성했습니다.
                    </Paper>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <Paper elevation={2} padding="1.25rem" hoverable onClick={() => handleClick("hoverable + onClick")}>
                        호버와 클릭을 모두 활성화하여 카드 항목처럼 상호작용하도록 만들었으며 마우스 오버 시 시각적인 강조가 적용되고 클릭 시 안내 알림이 뜨도록 처리했습니다.
                    </Paper>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <Paper elevation={0} padding="1rem">
                        그림자를 제거해 완전히 평평한 영역처럼 보이게 하여 배경에 자연스럽게 녹아들도록 했고 이 방식은 섹션 안의 서브 블록을 만들 때 유용합니다.
                    </Paper>
                </Box>
            </Grid>

            <Grid size={12}>
                <Box sx={{ mb: 2 }}>
                    <Paper elevation={4} padding="1.5rem" hoverable onClick={() => handleClick("강조 카드")}>
                        더 강한 그림자와 호버 효과를 함께 사용하여 강조 카드처럼 보이게 하였고 클릭 시 세부 페이지로 이동시키거나 상세 모달을 여는 패턴으로 확장해 사용할 수 있습니다.
                    </Paper>
                </Box>
            </Grid>
        </Layout>
    );
};

export default CommonPaper;
