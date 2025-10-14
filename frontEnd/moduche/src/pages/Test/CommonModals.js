import { Box, Button, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import { useState } from "react";
import { NormalModal, SlideModal } from "../../component/common/Modals";

const CommonModals = () => {
    const [openNormal, setOpenNormal] = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const [openLeft, setOpenLeft] = useState(false);
    const [openTop, setOpenTop] = useState(false);
    const [openBottom, setOpenBottom] = useState(false);
    return (
        <Layout padding={2} space={3}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonModals.js 문서입니다.</span><br />
                    - 중간에 팝업되는 <span style={{ fontWeight: "bold" }}>NormalModal</span> 입니다.  (props: open, close, title, children)<br />
                    - useState 선언이 필요합니다. (예시: {`const [openNormal, setOpenNormal] = useState(false);`})
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - open(필수): useState 활용<br />
                    - close(필수): useState 활용({`()=>setOpen(false)`})<br />
                    - title: 모달 내부 title입니다.<br />
                    - children(필수): 모달 content({`<NormalModal>여기에 입력하면 됩니다</NormalModal>`})<br /><br />
                </Box>
                <Button variant={"contained"} onClick={() => setOpenNormal(true)}>NormalModal(클릭하세요)</Button>
            </Grid>
            <Grid size={12}>
                <Box>
                    - 상/하/좌/우에서 slide되는  <span style={{ fontWeight: "bold" }}>SlideModal</span> 입니다.  (props: open, close, title, children, position, height, width)<br />
                    - useState 선언이 필요합니다. (예시: {`const [openNormal, setOpenNormal] = useState(false);`})
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - open(필수), close(필수), title, children(필수): 동일기능입니다.<br />
                    - position(필수): "right", "left", "top", "bottom" 중 택일합니다.(철자확인 필수)<br />
                    - height(position이 top, bottom일 때 사용): 모달 높이 조절 가능(0~100의 수치를 문자열로 작성해주세요-기본값 40)<br />
                    - width(position이 right, left일 때 사용): 모달 너비 조절 가능(0~100의 수치를 문자열로 작성해주세요-기본값 30)<br /><br />
                </Box>

                <Button variant={"contained"} onClick={() => setOpenRight(true)}>SlideModal-Right(클릭하세요)</Button>
                <Button variant={"contained"} onClick={() => setOpenLeft(true)}>SlideModal-Left(클릭하세요)</Button>
                <Button variant={"contained"} onClick={() => setOpenTop(true)}>SlideModal-Top(클릭하세요)</Button>
                <Button variant={"contained"} onClick={() => setOpenBottom(true)}>SlideModal-Bottom(클릭하세요)</Button>
            </Grid>

            <NormalModal
                open={openNormal}
                close={() => setOpenNormal(false)}
                title={"NormalModal 제목입니다"}
            >
                <Layout space={2}>
                    <Grid size={6} border={'1px solid black'}>
                        모달 content 내부입니다.
                    </Grid>
                    <Grid size={6} border={'1px solid black'}>
                        여기도 layout으로 공간 나누면 댐
                    </Grid>
                </Layout>
            </NormalModal>
            <SlideModal open={openRight} close={() => setOpenRight(false)} title={"SlideModal-Right 제목입니다"}
                position={"right"}>
                오른쪽에서 나오는 SlideModal, position={"right"}
            </SlideModal>
            <SlideModal open={openLeft} close={() => setOpenLeft(false)} title={"SlideModal-Left 제목입니다"}
                position={"left"}  width="90">
                왼쪽에서 나오는 SlideModal, position={"left"}<br/>
                놀랐죠? width를 90을 줬답니다
            </SlideModal>
            <SlideModal open={openTop} close={() => setOpenTop(false)} title={"SlideModal-Top 제목입니다"}
                position={"top"} >
                위에서 나오는 SlideModal, position={"top"}
            </SlideModal>
            <SlideModal open={openBottom} close={() => setOpenBottom(false)} title={"SlideModal-Bottom 제목입니다"}
                position={"bottom"} >
                아래에서 나오는 SlideModal, position={"bottom"}
            </SlideModal>
        </Layout>
    );
}

export default CommonModals;