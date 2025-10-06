import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const OriginTable = ({ datas, hover = [], clickEvent, id, padding }) => {

    const columns = Object.keys(datas[0]).filter(col => col !== id);
    const mainColor = "#1976d2";
    const cellBackGround = "#d0e4ff";
    const secondaryText = "#f5f5f5"
    return (
        <Table sx={{
            border: `1px solid ${secondaryText}`,
            borderRadius: 2,
            overflow: "hidden",
            // boxShadow: 2,
        }}>
            <TableHead>
                <TableRow sx={{
                    backgroundColor: secondaryText, // 연한 회색 배경
                    // borderBottom: `2px solid ${mainColor}`, // 강조선
                }}>
                    {columns.map((column, idx) => {
                        return (
                            <TableCell key={`column_${idx}`} sx={{ textAlign: "center", fontWeight: "bold", padding: padding }}>
                                {column}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {datas?.map((data, dataIdx) => {
                    return (
                        <TableRow key={`row_${dataIdx}`}
                            sx={{
                                "&:hover .MuiTableCell-root": {
                                    backgroundColor: cellBackGround,
                                },
                            }}
                        >
                            {columns.map((column, columnIdx) => {
                                return (
                                    <TableCell key={`row_${dataIdx}__column${columnIdx}`}
                                        sx={{
                                            textAlign: "center",
                                            cursor: hover.includes(column) ? "pointer" : "",
                                            color: hover.includes(column) ? mainColor : "",
                                            // borderRight: columnIdx !== columns.length - 1 ? "1px solid #e0e0e0" : "none",
                                            padding: padding
                                        }}
                                        onClick={hover.includes(column) ? () => clickEvent(data[id], column, data[column]) : () => { }}
                                    >
                                        {data[column]}
                                    </TableCell>

                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    )
}
export default OriginTable;