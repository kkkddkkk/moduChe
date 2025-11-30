import { useState } from "react";
import defaultClubImage from "./media/stretch.png";
import { Box, Grid, Pagination, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostCard } from "../common/PostCard";
import { HorizontalBanner } from "../common/SideBanner";

import adImage from "./media/ready.png";

const PostAreaComponent = ({ posts, totalPages, page, setPage }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  // ✅ 썸네일 안전하게 선택하는 함수
  const resolveThumbnail = (post) => {
    const raw =
      post.representativeImage ||
      post.thumbnailUrl ||
      post.imageUrl ||
      post.photoUrl; // 혹시 다른 이름으로 올 수도 있으니 후보 추가

    if (!raw) return defaultClubImage;
    if (typeof raw !== "string") return defaultClubImage;

    const trimmed = raw.trim();
    if (!trimmed) return defaultClubImage;
    if (trimmed === "(NULL)") return defaultClubImage;
    if (trimmed.toLowerCase() === "null") return defaultClubImage;

    return trimmed;
  };

  // ✅ 설명 텍스트도 여러 케이스 대응
  const resolveDesc = (post) => post.purpose ?? post.summary ?? post.desc ?? "";

  return (
    <Box sx={{ p: 3, pt: 0 }}>
      <HorizontalBanner
        adImage={adImage}
        clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
      />

      <Grid
        container
        spacing={3}
        justifyContent={isMobile ? "center" : "center"}
      >
        {posts.map((post, idx) => {
          const thumbnail = resolveThumbnail(post);
          const desc = resolveDesc(post);

          // id 안전하게 선택 (postId > communityId > idx)
          const key = post.postId ?? post.communityId ?? idx;

          return (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <PostCard
                type={"COMMUNITY"}
                clickURL={`/community/details/${post.postId}`}
                imageURL={thumbnail}
                postTitle={post.name}
                postDesc={desc}
                createdAt={post.createdAt}
                memberCount={post.memberCount}
                isSponsored={post.sponsored}
              />
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default PostAreaComponent;
