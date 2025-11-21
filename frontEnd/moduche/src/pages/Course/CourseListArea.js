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

const CourseListArea = () => {
  const navigate = useNavigate();

  // 검색어, 정렬 옵션, 페이지 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [page, setPage] = useState(1);

  // 강좌 리스트 (임시 더미)
  const [courses, setCourses] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    (async () => {
      try {
        const data = await getCourseList();
        setCourses(data);
      } catch (err) {
        console.error("강좌 리스트 로딩 실패: ", err);
      }
    })();
  }, []);

  const handleSearch = () => {
    console.log("텍스트 검색어:", searchTerm, "정렬:", sortOption);
    // 추후 백엔드 필터 연동 예정
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3, pt: 2 }}>
      {/* 상단 버튼: 강좌 등록 / 내 강좌 관리 */}
      <Box sx={{ display: "flex", gap: 1, flexGrow: 1, pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ whiteSpace: "nowrap" }}
          onClick={() => {
            // ✅ 여기서 로그인 여부 체크
            if (!isLoggedIn()) {
              alert(
                "강좌 등록은 로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다."
              );
              navigate("/account/login"); // 🔥 앞에 / 붙여서 절대 경로로
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

      {/* 중간 가로 배너 */}
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
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={3} key={course.courseId}>
            <PostCard
              type={"COURSE"}
              clickURL={`/course/details/${course.courseId}`}
              // 백엔드 필드에 맞게 수정
              imageURL={course.thumbnailUrl || DEFAULT_COURSE_IMAGE}
              postTitle={course.title}
              // summary가 있으면 summary, 없으면 description 일부
              postDesc={
                course.summary || course.description?.substring(0, 30) + "..."
              }
              // 등록일 createdAt
              createdAt={course.createdAt}
              // spotsLeft 같은 거 없음 → maxParticipants로 대체
              memberCount={course.maxParticipants}
              // isFeatured 없음 → false
              isSponsored={false}
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

export default CourseListArea;
