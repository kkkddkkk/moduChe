import { useState } from "react";
import defaultClubImage from "./media/stretch.png";
import {
    Box,
    Button,
    CardMedia,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import JoinModalComponent from "./JoinModalComponent";
import { OneAlignedButton } from "../common/Button";


const PostDetailComponent = ({ data }) => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("latest");
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const [openJoin, setOpenJoin] = useState(false);

    return (
        <>
            <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
                <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
                    ← 목록으로 돌아가기
                </Button>

                <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    {data.name}
                </Typography>

                <CardMedia
                    component="img"
                    image={data.imageUrl || defaultClubImage}
                    alt={`${data.name} 이미지`}
                    sx={{
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: 2,
                        mb: 3,
                    }}
                />

                <Typography variant="body1" sx={{ mb: 3 }}>
                    {data.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 4, color: "text.secondary" }}>
                    <Typography variant="body2">등록일: {data.createdAt}</Typography>
                    <Typography variant="body2">등록자: {data.author}</Typography>
                    <Typography variant="body2">회원 수: {data.memberCount}명</Typography>
                </Box>

                <OneAlignedButton
                    variant="contained"
                    align="right"
                    color="primary"
                    children={"가입 신청하기"}
                    onClick={() => setOpenJoin(true)}
                />

                <JoinModalComponent
                    open={openJoin}
                    onClose={() => setOpenJoin(false)}
                    clubName={data.name}
                />
            </Box>
        </>
    );
}
export default PostDetailComponent;