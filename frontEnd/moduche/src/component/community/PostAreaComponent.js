import defaultClubImage from "./media/stretch.png";
import { Box, Grid, Pagination, useTheme, useMediaQuery } from "@mui/material";
import { PostCard } from "../common/PostCard";

const PostAreaComponent = ({ posts, totalPages, page, setPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3, pt: 0 }}>
      {/* 게시글 리스트 영역 */}
      <Grid
        container
        spacing={3}
        justifyContent={isMobile ? "center" : "center"}
      >
        {posts.map((post) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={post.postId ?? post.communityId}
          >
            <PostCard
              type={"COMMUNITY"}
              clickURL={`/community/details/${post.postId}`}
              imageURL={post.representativeImage || defaultClubImage}
              postTitle={post.name}
              postDesc={post.desc}
              createdAt={post.createdAt}
              memberCount={post.memberCount}
              isSponsored={post.sponsored}
            />
          </Grid>
        ))}
      </Grid>

      {/* 페이지네이션 */}
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
