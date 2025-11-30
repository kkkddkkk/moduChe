// src/component/course/CourseListArea.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Pagination,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostCard } from "../../component/common/PostCard";
import { HorizontalBanner } from "../../component/common/SideBanner";
import { getCourseList } from "../../api/courseAPI";
import { isLoggedIn } from "../../utils/auth";

const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop";
const AD_IMAGE =
  "https://images.unsplash.com/photo-1526403225475-4aa7c3a29c06?q=80&w=1200&auto=format&fit=crop";

const CourseListArea = ({ items, total }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [page, setPage] = useState(1);

  // 🔹 기본 리스트 (검색 전)
  const [courses, setCourses] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 🔹 처음 진입하거나, 검색 결과가 없는 경우에만 기본 리스트 로딩
  useEffect(() => {
    if (items == null) {
      (async () => {
        try {
          const data = await getCourseList();
          setCourses(data);
        } catch (err) {
          console.error("강좌 리스트 로딩 실패: ", err);
        }
      })();
    }
  }, [items]);

  const handleSearch = () => {
    console.log("텍스트 검색어:", searchTerm, "정렬:", sortOption);
    // 추후 이 텍스트 검색은 QuickSearchBar와 합칠지 결정
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  // 🔹 실제로 렌더링할 리스트: 검색 결과가 있으면 그걸 우선 사용
  const listToRender = items ?? courses;

  return (
    <Box sx={{ p: 3, pt: 2 }}>
      {/* 상단 버튼들 */}
      <Box sx={{ display: "flex", gap: 1, flexGrow: 1, pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ whiteSpace: "nowrap" }}
          onClick={() => {
            if (!isLoggedIn()) {
              alert(
                "강좌 등록은 로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다."
              );
              navigate("/account/login");
              return;
            }
            navigate("/course/register");
          }}
        >
          강좌 등록 신청
        </Button>

        <Button
          variant="outlined"
          color="primary"
          sx={{ whiteSpace: "nowrap" }}
          onClick={() => navigate(`/course/manage`)}
        >
          내 강좌 관리
        </Button>
      </Box>

      {/* 가로 배너 */}
      <HorizontalBanner
        adImage={AD_IMAGE}
        clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
      />

      {/* 강좌 카드 리스트 */}
      <Grid
        container
        spacing={3}
        justifyContent={isMobile ? "center" : "center"}
        sx={{ mt: 1 }}
      >
        {listToRender.map((course) => (
          <Grid item xs={12} sm={6} md={3} key={course.courseId}>
            <PostCard
              type={"COURSE"}
              clickURL={`/course/details/${course.courseId}`}
              imageURL={course.thumbnailUrl || DEFAULT_COURSE_IMAGE}
              postTitle={course.title}
              postDesc={
                course.summary || course.description?.substring(0, 30) + "..."
              }
              createdAt={course.createdAt}
              memberCount={course.maxParticipants}
              isSponsored={false}
            />
          </Grid>
        ))}
      </Grid>

      {/* 페이지네이션: 일단 기존 더미 유지 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={5} page={page} onChange={handlePageChange} />
      </Box>
    </Box>
  );
};

export default CourseListArea;
