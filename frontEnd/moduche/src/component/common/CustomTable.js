import { lighten, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from "@mui/material";

const CustomTable = ({ datas, hover = [], columns = [], widths = [], formatter = [], padding, clickEvent, id }) => {

    const format = (column, data, formatting) => {
        const formatValue = formatting.find(item => column in item);
        return (
            formatValue ? formatValue[column](data) : data
        );
    }
    const theme = useTheme();
    const mainColor = theme.palette.secondary.main;
    const cellBackGround = lighten(mainColor,0.8);
    const secondaryText = lighten(theme.palette.text.secondary,0.9);
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
                }}>
                    {columns.map((column, idx) => {
                        return (
                            <TableCell key={`column_${idx}`} sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                padding: padding,
                                width: `${widths[idx]}%`
                            }}>
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
                                            padding: padding
                                        }}
                                        onClick={hover.includes(column) ? () => clickEvent(data[id], column, data[column]) : () => { }}
                                    >
                                        {format(column, data[column], formatter)}
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
export default CustomTable;