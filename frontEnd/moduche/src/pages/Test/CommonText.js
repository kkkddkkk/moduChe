import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
// import { useState } from "react";

import { CenterTitle, Contents, Contents100, SmallerSubTitle, StartTitle, SubTitle } from "../../component/common/Text";

const CommonModals = () => {
    return (
        <Layout padding={2} space={3}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonText.js 문서입니다.</span><br />
                    - 제목, <span style={{ fontWeight: "bold" }}>CenterTitle, StartTitle</span> 입니다.  (props: color, children, margin, italic, fontSize, bold)<br />
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - children(필수): text content({`예시: <CenterTitle>CenterTitle입니다.</CenterTitle>`})<br />
                    - color: 글자색. 기본값은 theme 기반으로 설정되어있습니다. 필요시 따로 설정하실 수 있습니다.<br />
                    - margin: 기본값이 설정되어있습니다.(Title은 "3% 0", 나머지는 "0")<br />
                    - italic: true 시 italic 처리 됩니다.<br />
                    - bold: contents들만 가지는 props입니다. true 시 bold 처리 됩니다.<br />
                    - fontSize: contents들만 가지는 props입니다. 변경 필요 시 수치로 값을 넣어주시면 됩니다.(기본값: 16) <br /><br />
                </Box>
            </Grid>
            <Grid size={12}>
                <CenterTitle>* CenterTitle입니다.</CenterTitle>
                <StartTitle>* StartTitle입니다.</StartTitle>
                <SubTitle italic>* SubTitle입니다. italic을 줬습니다</SubTitle>
                <SmallerSubTitle>* SmallerSubTitle입니다.</SmallerSubTitle>
                <Contents100 bold> * Contents100입니다. bold를 줬습니다.</Contents100>
                <Contents italic> * Contents입니다. italic을 줬습니다&nbsp;</Contents>
                <Contents>* 또 다른 Contents입니다. contents는 inlineBlock이라 컴포넌트가 옆으로 쌓입니다. &nbsp;</Contents>
                <Contents >* contents들의 총 길이가 화면보다 길 경우, 줄바꿈처리됩니다. 화면 크기를 변경해 확인해보세요.&nbsp;</Contents>
                <SmallerSubTitle>* SmallerSubTitle,&nbsp;
                    <Contents>* Contents</Contents>
                    입니다.&nbsp;
                    <Contents>* Contents는 이렇게, span처럼 활용할 수도 있습니다.</Contents>
                </SmallerSubTitle>

            </Grid>

        </Layout>
    );
}

export default CommonModals;