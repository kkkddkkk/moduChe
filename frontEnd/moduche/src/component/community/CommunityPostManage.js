import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
} from "@mui/material";

const CommunityPostManage = () => {
    const posts = [
        { id: 1, title: "10월 아침 체조 모집", date: "2025-10-15" },
        { id: 2, title: "가을 트래킹 일정 공지", date: "2025-09-30" },
    ];

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                모집 게시글 관리
            </Typography>

            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="새 모집글 제목을 입력하세요"
                />
                <Button variant="contained">등록</Button>
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>제목</TableCell>
                        <TableCell>등록일</TableCell>
                        <TableCell align="right">관리</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.title}</TableCell>
                            <TableCell>{p.date}</TableCell>
                            <TableCell align="right">
                                <Button size="small" color="info">
                                    수정
                                </Button>
                                <Button size="small" color="error">
                                    삭제
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
export default CommunityPostManage;
