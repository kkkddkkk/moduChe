import { useState } from "react";
import {
    Box,
    TextField,
    Chip,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    alpha,
} from "@mui/material";
import { X as XIcon } from "lucide-react";

export const HashTagInput = ({ form, setForm }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [input, setInput] = useState("");

    // ✅ form.hashtags 기본값 보정
    const hashtags = Array.isArray(form?.hashtags) ? form.hashtags : [];

    const handleKeyDown = (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            const trimmed = input.trim();
            if (trimmed.length <= 1) return;

            const tag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
            if (hashtags.length >= 10) return;
            if (!hashtags.includes(tag)) {
                setForm((prev) => ({
                    ...prev,
                    hashtags: [...hashtags, tag],
                }));
            }
            setInput("#");
        }
    };

    const handleDelete = (tagToDelete) => {
        setForm((prev) => ({
            ...prev,
            hashtags: hashtags.filter((tag) => tag !== tagToDelete),
        }));
    };

    const isMax = hashtags.length >= 10;

    return (
        <Box>
            <Paper
                variant="outlined"
                sx={{
                    p: isMobile ? 1.5 : 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: isMobile ? 0.7 : 1,
                    minHeight: 56,
                }}
            >
                {hashtags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDelete(tag)}
                        deleteIcon={
                            <XIcon size={isMobile ? 13 : isTablet ? 15 : 16} />
                        }
                        sx={{
                            fontSize: isMobile
                                ? "0.75rem"
                                : isTablet
                                ? "0.8rem"
                                : "0.9rem",
                            fontWeight: 500,
                            borderRadius: "9999px",
                            px: isMobile ? 0.7 : isTablet ? 1 : 1.3,
                            py: isMobile ? 0.3 : 0.4,
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.12
                            ),
                            color: theme.palette.primary.main,
                            transition: "all 0.2s ease",
                            "& .MuiChip-deleteIcon": {
                                color: alpha(theme.palette.primary.main, 0.7),
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                },
                            },
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.22
                                ),
                            },
                        }}
                    />
                ))}

                <TextField
                    variant="standard"
                    type="text"
                    value={input}
                    disabled={isMax}
                    onChange={(e) =>
                        setInput(
                            e.target.value.startsWith("#")
                                ? e.target.value
                                : `#${e.target.value}`
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                        isMax
                            ? "해시태그 최대 10개까지 가능합니다"
                            : "#해시태그 입력 후 스페이스 또는 엔터"
                    }
                    InputProps={{
                        disableUnderline: true,
                    }}
                    sx={{
                        flex: 1,
                        minWidth: 120,
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                    }}
                />
            </Paper>

            <Typography
                variant="caption"
                sx={{
                    mt: 1,
                    ml: 1,
                    color: isMax ? "error.main" : "text.secondary",
                    fontSize: isMobile ? "0.7rem" : "0.75rem",
                }}
            >
                {isMax
                    ? "해시태그는 최대 10개까지 입력할 수 있습니다."
                    : `${hashtags.length}/10개 입력됨`}
            </Typography>
        </Box>
    );
};
