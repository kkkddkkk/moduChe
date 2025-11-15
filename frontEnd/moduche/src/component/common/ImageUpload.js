import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Avatar,
    IconButton,
    Badge,
    useTheme,
    alpha,
    Grid,
    useMediaQuery,
} from "@mui/material";
import { X as XIcon, Star as StarIcon } from "lucide-react";

export const ImageUpload = ({ form, setForm }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const [images, setImages] = useState([]);

    //이미지 초회 렌더링
    useEffect(() => {
        if (!form?.images) return;

        // form.images는 [{file, url}] 형식이라고 가정
        setImages(form.images);
    }, [form.images]);

    // 이미지 추가.
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newImages = files.slice(0, 3 - images.length).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        const updatedImages = [...images, ...newImages];

        setImages(updatedImages);

        setForm((prev) => ({
            ...prev,
            images: updatedImages,
        }));

        e.target.value = null;
    };

    // 이미지 삭제.
    const handleDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);

        setImages(updatedImages);

        setForm((prev) => ({
            ...prev,
            images: updatedImages,
        }));
    };
    const isMax = images.length >= 3;

    return (
        <Grid container size={12}>
            <Grid size={isMobile ? 12 : 4} mb={isMobile ? 2 : 0}>
                {/* 업로드 버튼. */}
                <Button
                    variant="outlined"
                    component="label"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                        borderColor: alpha(theme.palette.primary.main, 0.6),
                        color: theme.palette.primary.main,
                        flexShrink: 0,
                        "&:hover": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.08
                            ),
                            borderColor: theme.palette.primary.main,
                        },
                    }}
                    disabled={isMax}
                >
                    {isMax ? "최대 3장 업로드됨" : "이미지 업로드"}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                </Button>
            </Grid>
            <Grid size={isMobile ? 12 : 8}>
                {/* 이미지 미리보기 섹션. */}
                <Box
                    sx={{
                        display: "flex",
                        gap: isMobile || isTablet ? 1 : 2,
                        minHeight: 125,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        p: 2,
                        boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
                        border: `1px solid ${alpha(
                            theme.palette.grey[400],
                            0.3
                        )}`,
                    }}
                >
                    {images.map((img, index) => (
                        <Badge
                            key={index}
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            badgeContent={
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(index)}
                                    sx={{
                                        backgroundColor: "rgba(0,0,0,0.55)",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0.75)",
                                        },
                                    }}
                                >
                                    <XIcon size={14} />
                                </IconButton>
                            }
                        >
                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    src={img.url}
                                    variant="rounded"
                                    sx={{
                                        width: isMobile ? 80 : 90,
                                        height: isMobile ? 80 : 90,
                                        border: "2px solid",
                                        borderColor:
                                            index === 0
                                                ? theme.palette.primary.main
                                                : "transparent",
                                        boxShadow:
                                            index === 0
                                                ? `0 0 6px ${alpha(
                                                      theme.palette.primary
                                                          .main,
                                                      0.4
                                                  )}`
                                                : "none",
                                        transition: "all 0.2s ease",
                                    }}
                                />
                                {/* 대표 이미지 마크 => 파란 별...? */}
                                {index === 0 && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 4,
                                            left: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.4,
                                            px: 0.9,
                                            py: 0.3,
                                            borderRadius: "9999px",
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                            boxShadow: `0 2px 6px ${alpha(
                                                theme.palette.primary.main,
                                                0.25
                                            )}`,
                                        }}
                                    >
                                        <StarIcon size={13} color="#fff" />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "white",
                                                fontSize: "0.7rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            대표
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Badge>
                    ))}

                    {/* 안내 문구. */}
                    {images.length === 0 && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                display: "block",
                                textAlign: "center",
                                width: "100%",
                                opacity: 0.6,
                            }}
                        >
                            업로드된 이미지가 없습니다. <br />첫 번째로 업로드한
                            이미지가 대표로 지정됩니다.
                        </Typography>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};
