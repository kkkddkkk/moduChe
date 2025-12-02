import {
    Box,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Pagination,
    InputAdornment,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper as MuiPaper,
    Snackbar,
    Alert,
    Badge,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { formattedDate } from "../community/utility/communityUtility";
import { formatBannerPeriod, formatDaysOnly } from "./utility/bannerUtility";

const BannerOnManageRow = ({ apply, onDetail }) => {
    return (
        <TableRow
            key={apply.id}
            hover
            sx={{
                "&:last-of-type td": {
                    borderBottom: 0,
                },
                transition: "background-color 0.15s ease-in-out",
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.03)",
                },
            }}
        >
            <TableCell
                sx={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                }}
            >
                BA-{apply.id}
            </TableCell>
            <TableCell
                sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {apply.bannerTypeLabel === "MAIN"
                    ? "메인 배너"
                    : apply.bannerTypeLabel === "SIDE"
                    ? "사이드 배너"
                    : "상단 배너"}
            </TableCell>
            <TableCell
                sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {formattedDate(apply.startDate)}
            </TableCell>
            <TableCell
                sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {formattedDate(apply.endDate)}
            </TableCell>
            <TableCell sx={{ overflow: "visible" }}>
                <Chip
                    label={apply.priorityLabel}
                    size="small"
                    color={
                        apply.priorityLabel === "PREMIUM"
                            ? "primary"
                            : "default"
                    }
                    sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        px: 1,
                        maxWidth: "none",
                    }}
                />
            </TableCell>

            <TableCell
                sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {apply.ownerName}
            </TableCell>

            <TableCell align="right">
                <Tooltip title="더보기">
                    <IconButton
                        size="small"
                        onClick={() => {
                            onDetail(apply);
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};
export default BannerOnManageRow;
