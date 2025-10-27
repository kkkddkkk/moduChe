import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Contents, SmallerSubTitle, SubTitle } from "./Text";

export function PostCard({
    type, //게시물 유형 (COURSE or COMMUNITY)
    clickURL, //게시물 카드 클릭 시 이동 링크.
    postTitle, //게시물 카드 최상단 제목 내용.
    imageURL, //게시물 중앙부 이미지 URL.
    postDesc, //게시물 상세 문구.
    createdAt, //게시물 등록일.
    isSponsored, //유료 홍보 등록 여부.
    memberCount, //동아리 전용 회원 수 기입란(COMMUNITY시 활성).
}) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                width: 320,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "15px",
                border: isSponsored ? "1px solid #bcc3d0" : "1px solid #d4d4d4",
                background: isSponsored ? "#e7f0fa" : "#ffffff",
            }}
        >
            <CardActionArea onClick={() => navigate(clickURL)}>
                <CardContent>
                    {/* 게시물 카드 제목. */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <SubTitle children={postTitle} color="#515151" />
                        {isSponsored && (
                            <Chip
                                label="광고"
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: "#679cd4", 
                                    color: "#679cd4", 
                                    backgroundColor: "#ffffff",
                                    fontWeight: 500,
                                }}
                            />
                        )}
                    </Box>

                    {/* 동아리 이미지. */}
                    <CardMedia
                        component="img"
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
                    <Contents children={postDesc} />

                    {/* 등록일 / 회원 수 → 한 줄 양 끝 배치. */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0.5,
                        }}
                    >
                        <Contents
                            children={"등록일: " + createdAt}
                            color={"text.secondary"}
                        />

                        {type == "COMMUNITY" && (
                            <Contents
                                children={"회원 수: " + memberCount + "명"}
                                color={"text.secondary"}
                            />
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
