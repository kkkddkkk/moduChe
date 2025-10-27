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

const PostAreaComponent = () => {
    const navigate = useNavigate();

    // 검색어, 정렬 옵션, 페이지 상태.
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("latest");
    const [page, setPage] = useState(1);

    const [posts, setPosts] = useState([]);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 0~600px

    useEffect(() => {
        //더미 데이터.
        const dummy = Array.from({ length: 12 }).map((_, i) => ({
            id: i + 1,
            name: `임시 동아리 이름${i + 1}`,
            description:
                "안녕하세요! 더조은기관에서 아침 체조 모임을 함께하실 이웃분들을 모집하고 있습니다.".slice(
                    0,
                    30
                ),
            createdAt: "2025-10-19",
            memberCount: Math.floor(Math.random() * 100),
            isSponsored: i < 4 ? true : false,
        }));
        setPosts(dummy);
    }, []);

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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 1, flexGrow: 1, pb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={() => navigate(`/community/register`)}
                >
                    등록하기
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={() => navigate(`/community/manage`)}
                >
                    관리하기
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="동아리명 또는 키워드 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ whiteSpace: "nowrap" }}
                        onClick={handleSearch}
                    >
                        검색
                    </Button>
                </Box>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>정렬 기준</InputLabel>
                    <Select
                        value={sortOption}
                        label="정렬 기준"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="latest">최신 등록순</MenuItem>
                        <MenuItem value="members">회원 많은순</MenuItem>
                        <MenuItem value="name">가나다 순</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                            clickURL={`/community/details/${post.id}`}
                            imageURL={post.imageUrl || defaultClubImage}
                            postTitle={post.name}
                            postDesc={post.description + "..."}
                            createdAt={post.createdAt}
                            memberCount={post.memberCount}
                            isSponsored={post.isSponsored}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* 하단 페이지네이션 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination count={5} page={page} onChange={handlePageChange} />
            </Box>
        </Box>
    );
};

export default PostAreaComponent;
