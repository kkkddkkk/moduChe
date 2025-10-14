
import { Box, Grid } from "@mui/material";
import Layout from "../../component/common/Layout";
import OriginTable from "../../component/common/OriginTable";
import CustomTable from "../../component/common/CustomTable";
import Paper from "../../component/common/Paper";

const CommonTable = () => {
    const tempData = [
        { "tempId": 1, "tempColumn1": "tempRow1", "tempColumn2": "tempRow1", "tempColumn3": "tempRow1", "tempColumn4": "tempRow1", "tempColumn5": "tempRow1" },
        { "tempId": 2, "tempColumn1": "tempRow2", "tempColumn2": "tempRow2", "tempColumn3": "tempRow2", "tempColumn4": "tempRow2", "tempColumn5": "tempRow2" },
        { "tempId": 3, "tempColumn1": "tempRow3", "tempColumn2": "tempRow3", "tempColumn3": "tempRow3", "tempColumn4": "tempRow3", "tempColumn5": "tempRow3" },
        { "tempId": 4, "tempColumn1": "tempRow4", "tempColumn2": "tempRow4", "tempColumn3": "tempRow4", "tempColumn4": "tempRow4", "tempColumn5": "tempRow4" },
        { "tempId": 5, "tempColumn1": "tempRow5", "tempColumn2": "tempRow5", "tempColumn3": "tempRow5", "tempColumn4": "tempRow5", "tempColumn5": "tempRow5" },
    ];

    const clickedOriginTable = (id, column, data) => {
        alert(`tempId: ${id}, ${column}: ${data}`);
    }

    const format1 = (data) => {
        return data + " - format1 사용";
    }
    const format3 = (data) => {
        if (data.includes("1"))
            return <Box sx={{ border: "1px solid red", backgroundColor: "red" }}>1</Box>;
        if (data.includes("2"))
            return <Box sx={{ border: "1px solid orange", backgroundColor: "orange" }}>2</Box>;
        if (data.includes("3"))
            return <Box sx={{ border: "1px solid yellow", backgroundColor: "yellow" }}>3</Box>;
        if (data.includes("4"))
            return <Box sx={{ border: "1px solid green", backgroundColor: "green", color: "white" }}>4</Box>;
        if (data.includes("5"))
            return <Box sx={{ border: "1px solid blue", backgroundColor: "blue", color: "white" }}>5</Box>;
    }
    const format4 = (data) => {
        return (
            data.includes("4") ? <span style={{ color: "green" }}>{data}</span> : data
        );
    }

    return (
        <Layout space={2} padding={2}>
            <Grid size={12}>
                <Box>
                    <span style={{ fontWeight: "bold" }}>* pages/Test/CommonTable.js 문서입니다.</span><br />
                    -  모든 데이터를 전부 활용하는<span style={{ fontWeight: "bold" }}>OriginTable</span> 입니다. 백엔드에서 데이터 가공을 마쳤을 때 유용합니다. (props: datas, hover, clickEvent, id, padding)
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - datas(필수): backend에서 가져온 데이터를 그대로 넣으면, id로 설정한 컬럼을 제외한 모든 데이터가 순서대로 표에 삽입됩니다.<br />
                    - hover: 컬럼명을 배열 형태로 넣으면(지금은 ["tempColumn1", "tempColumn3"]) 해당 컬럼에 속한 데이터에 강조표시+클릭 이벤트를 삽입할 수 있습니다.<br />
                    - clickEvent: hover에서 설정한 컬럼만을 대상으로 클릭 이벤트를 지정합니다. props를 활용하여 (id, column, data) 값을 얻을 수 있습니다.(문서 참고)<br />
                    - id: 데이터 중 id에 속하는 컬럼명을 문자열로 넣어주세요(지금은 "tempId")<br />
                    - padding: 설명 생략
                    <Paper>
                        <pre>
                            {`<OriginTable
    datas={tempData}
    hover={["tempColumn1", "tempColumn3"]}
    clickEvent={clickedOriginTable}
    id={"tempId"}
    padding={2}
/>`}
                        </pre>
                    </Paper>
                </Box>
            </Grid>
            <Grid size={1} />
            <Grid size={10}>
                <OriginTable
                    datas={tempData}
                    hover={["tempColumn1", "tempColumn3"]}
                    clickEvent={clickedOriginTable}
                    id={"tempId"}
                    padding={2}
                />
            </Grid>
            <Grid size={1} />

            <Grid size={12}>
                <Box>
                    -  직접 데이터를 가공할 수 있는<span style={{ fontWeight: "bold" }}>CustomTable</span> 입니다. (props: datas, columns, widths, formatter, hover, clickEvent, id, padding)
                    <br /><br />
                    <span style={{ fontWeight: "bold" }}>** props 설명</span><br />
                    - datas(필수): table 생성 기반 데이터입니다. 이 페이지에서는 OriginTable과 동일한 데이터를 사용했습니다.<br />
                    - columns(필수): 배열 형태로 필요한 컬럼만 순서대로 넣으시면 됩니다(지금은 ["tempColumn5", "tempColumn1", "tempColumn3", "tempColumn4"])<br />
                    - widths: 배열 형태로 모든 값의 합이 100이 되도록 분배하면 됩니다(지금은 ["10", "20", "40", "30"])<br />
                    - formatter: 객체 배열 형태로 {`([{컬럼명: 포맷메서드}])`} 입력하시면 됩니다. 포맷 메서드는 props 하나(data로 치환됨)를 활용해서 작성합니다.(문서 참고)<br />
                    (지금은 {`[{ "tempColumn1": format1 },{ "tempColumn3": format3 },{ "tempColumn4": format4 }]`})<br />
                    - hover, clickEvent, id, padding: 동일기능입니다.<br />
                    <Paper>
                        <pre>
                            {`<CustomTable
    datas={tempData}
    columns={["tempColumn5", "tempColumn1", "tempColumn3", "tempColumn4"]}
    widths={["10", "20", "40", "30"]}
    formatter={[
        { "tempColumn1": format1 },
        { "tempColumn3": format3 },
        { "tempColumn4": format4 },
    ]}
    hover={["tempColumn1", "tempColumn5"]}
    clickEvent={clickedOriginTable}
    id={"tempId"}
    padding={1}
/>`}
                        </pre>
                    </Paper>
                </Box>
            </Grid>
            <Grid size={2} />
            <Grid size={8}>
                <CustomTable
                    datas={tempData}
                    columns={["tempColumn5", "tempColumn1", "tempColumn3", "tempColumn4"]}
                    widths={["10", "20", "40", "30"]}
                    formatter={[
                        { "tempColumn1": format1 },
                        { "tempColumn3": format3 },
                        { "tempColumn4": format4 },
                    ]}
                    hover={["tempColumn1", "tempColumn5"]}
                    clickEvent={clickedOriginTable}
                    id={"tempId"}
                    padding={1}
                />
            </Grid>
            <Grid size={2} />
        </Layout>

    );
}

export default CommonTable;