import {
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

const CommunityEnrollmentsManage = () => {
    // 더미 데이터
    const joinRequests = [
        { id: 1, name: "홍길동", reason: "함께 운동하고 싶어요" },
        { id: 2, name: "김영희", reason: "친구 추천으로 왔어요" },
    ];

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                가입 요청 목록
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>이름</TableCell>
                        <TableCell>지원 동기</TableCell>
                        <TableCell align="right">관리</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {joinRequests.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.reason}</TableCell>
                            <TableCell align="right">
                                <Button size="small" color="success">
                                    승인
                                </Button>
                                <Button size="small" color="error">
                                    거절
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
export default CommunityEnrollmentsManage;
