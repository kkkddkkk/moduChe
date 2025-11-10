import { useState, useEffect } from "react";
import defaultClubImage from "./media/stretch.png";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Pagination,
    InputLabel,
    FormControl,
    CardMedia,
    CardActionArea,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TwoAlignedButtons } from "../common/Button";
import { PostCard } from "../common/PostCard";
import { HorizontalBanner } from "../common/SideBanner";

import adImage from "./media/ready.png";

const PostAreaComponent = ({ posts, totalPages, page, setPage }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 0~600px

    // 검색어, 정렬 옵션, 페이지 상태.
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("latest");

    const handleSearch = () => {
        console.log("검색어 입력:", searchTerm);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ p: 3, pt: 0 }}>
            <HorizontalBanner
                adImage={adImage}
                clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
            />
            {/* 게시글 리스트 영역 */}
            <Grid
                container
                spacing={3}
                justifyContent={isMobile ? "center" : "center"}
            >
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={3} key={post.id}>
                        <PostCard
                            type={"COMMUNITY"}
                            clickURL={`/community/details/${post.communityId}`}
                            imageURL={
                                post.representativeImage || defaultClubImage
                            }
                            postTitle={post.name}
                            postDesc={post.desc}
                            createdAt={post.createdAt}
                            memberCount={post.memberCount}
                            isSponsored={post.sponsored}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* 하단 페이지네이션 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
        </Box>
    );
};

export default PostAreaComponent;
