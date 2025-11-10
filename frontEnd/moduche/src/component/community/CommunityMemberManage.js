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

const CommunityMemberManage = () => {
    const members = [
        { id: 1, name: "고주임", role: "회장" },
        { id: 2, name: "홍길동", role: "회원" },
    ];

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                현재 회원 목록
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>이름</TableCell>
                        <TableCell>역할</TableCell>
                        <TableCell align="right">관리</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((m) => (
                        <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.role}</TableCell>
                            <TableCell align="right">
                                <Button size="small" color="error">
                                    탈퇴
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default CommunityMemberManage;
