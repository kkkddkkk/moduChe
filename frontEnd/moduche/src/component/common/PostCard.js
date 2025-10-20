import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function PostCard({
    type, //게시물 유형 (COURSE or COMMUNITY)
    clickURL, //게시물 카드 클릭 시 이동 링크.
    postTitle, //게시물 카드 최상단 제목 내용.
    imageURL, //게시물 중앙부 이미지 URL.
    postDesc, //게시물 상세 문구.
    createdAt, //게시물 등록일.
    memberCount, //동아리 전용 회원 수 기입란(COMMUNITY시 활성).
}) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                width: 240,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <CardActionArea onClick={() => navigate(clickURL)}>
                <CardContent>
                    {/* 게시물 카드 제목. */}
                    <Typography variant="h6" noWrap>
                        {postTitle}
                    </Typography>

                    {/* 동아리 이미지. */}
                    <CardMedia
                        component="img"
                        // height="160"
                        image={imageURL}
                        alt={`${postTitle} 이미지`}
                        sx={{
                            objectFit: "cover",
                            aspectRatio: "1 / 1",
                            borderRadius: 1,
                            my: 1,
                        }}
                    />

                    {/* 동아리 설명 (고정 높이 + 자동 잘림 처리). */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            my: 1,
                            height: "48px",
                            lineHeight: "1.5",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {postDesc}
                    </Typography>

                    {/* 등록일 / 회원 수 → 한 줄 양 끝 배치. */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0.5,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            등록일: {createdAt}
                        </Typography>
                        {type == "COMMUNITY" && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                회원 수: {memberCount}명
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
