// src/pages/Course/CourseDetail.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Container } from "@mui/material";

import Layout from "../../component/common/Layout";
import CourseImage from "./CourseImage";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import CourseSidebar from "./CourseSidebar";

import {
  getCourseHeader,
  getCourseDescription,
  getEnrollProfile,
} from "../../api/courseAPI";
import { mapHeaderToProps } from "../../api/coursemappers/courseMapper";
import Loading from "../../component/common/Loading";
import EnrollModal from "./EnrollModal";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [ui, setUi] = useState(null);
  const [desc, setDesc] = useState(null);
  const [error, setError] = useState(null);

  const [sessionId, setSessionId] = useState("");
  const [date, setDate] = useState("");
  const [spotsLeft, setSpotsLeft] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  // ✅ 기본 sessionId / date 계산
  const computeInitialSessionAndDate = (mapped) => {
    const sessions = mapped.sessions ?? [];
    const datesBySession = mapped.datesBySession ?? {};

    let sid = mapped.defaultSessionId || sessions[0]?.id || "";
    let first = (sid && datesBySession[sid] && datesBySession[sid][0]) || "";

    if (!first) {
      for (const s of sessions) {
        const arr = datesBySession[s.id] || [];
        if (arr.length > 0) {
          sid = s.id;
          first = arr[0];
          break;
        }
      }
    }
    return { initialSessionId: sid, initialDate: first };
  };

  // ✅ 강좌 헤더/설명 로딩
  useEffect(() => {
    if (!courseId) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const headerRes = await getCourseHeader(courseId);
        const descRes = await getCourseDescription(courseId);
        console.log("[headerRes.thumbnailUrl]", headerRes.thumbnailUrl);

        if (!alive) return;

        const mapped = mapHeaderToProps(headerRes, descRes);
        console.log("[ui.thumbnailUrl after map]", mapped.thumbnailUrl);
        setUi(mapped);
        setDesc(descRes);

        const { initialSessionId, initialDate } =
          computeInitialSessionAndDate(mapped);

        setSessionId(initialSessionId);
        setDate(initialDate);

        const remainForSid =
          mapped.sessions?.find((s) => s.id === initialSessionId)?.remaining ??
          0;
        setSpotsLeft(remainForSid);
      } catch (e) {
        console.error("❌ [CourseDetail] 로드 실패:", e);
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [courseId]);

  // ✅ 현재 로그인 유저 (수강신청 모달용) 로딩
  useEffect(() => {
    (async () => {
      try {
        const me = await getEnrollProfile();
        // me = { userId, username, name, phone, email }
        setCurrentUser(me);
      } catch (e) {
        console.error("현재 유저 정보 로드 실패", e);
      }
    })();
  }, []);

  // 🔁 세션 바뀔 때마다 해당 세션의 좌석/날짜 동기화
  useEffect(() => {
    if (!ui || !sessionId) return;

    const remaining =
      ui.sessions?.find((s) => s.id === sessionId)?.remaining ?? 0;
    setSpotsLeft(remaining);

    const first = ui.datesBySession?.[sessionId]?.[0] || "";
    if (first) setDate(first);
  }, [sessionId, ui]);

  // ===== 로딩/에러 처리 =====
  if (loading && !ui) {
    return <Loading open={true} text="강좌 상세 정보를 가져오고 있습니다." />;
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <h2>강좌 정보를 불러오지 못했습니다.</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
            {String(error.message || error)}
          </pre>
        </Container>
      </Layout>
    );
  }

  if (!ui) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <h2>강좌 데이터가 없습니다.</h2>
        </Container>
      </Layout>
    );
  }

  const tags = desc?.tags ?? ui?.tags ?? [];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 전체 2컬럼: 왼쪽(이미지+헤더+상세) / 오른쪽(사이드바) */}
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {/* ===== 왼쪽 컬럼 ===== */}
          <Box
            sx={{
              flex: { lg: 3 },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* 1) 상단 카드 영역 (이미지 + 헤더) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 3,
              }}
            >
              {/* 이미지 영역 */}
              <Box sx={{ flex: { lg: 2 }, minWidth: 0 }}>
                <CourseImage
                  hasImage={true}
                  src={
                    ui.thumbnailUrl ||
                    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
                  }
                />
              </Box>

              {/* 헤더 영역 */}
              <Box sx={{ flex: { lg: 3 }, minWidth: 0 }}>
                <CourseHeader
                  hasHeader={true}
                  sessions={ui.sessions}
                  datesBySession={ui.datesBySession}
                  sessionId={sessionId}
                  setSessionId={setSessionId}
                  date={date}
                  setDate={setDate}
                  showMeta={false}
                  emphasizeByline={true}
                  titleText={ui.titleText}
                  bylineName={ui.bylineName}
                  bylineOrg={ui.bylineOrg}
                  periodStart={ui.periodStart}
                  periodEnd={ui.periodEnd}
                  scheduleLine={ui.scheduleLine}
                  tags={ui.tags}
                  locationText={ui.locationText}
                />
              </Box>
            </Box>

            {/* 2) 하단 상세 설명 */}
            <CourseDescription
              hasDetail={true}
              html={desc?.description}
              tags={desc?.tags ?? ui.tags}
              locationText={ui.locationText}
            />
          </Box>

          {/* ===== 오른쪽 컬럼(사이드바) ===== */}
          <Box
            sx={{
              flex: { lg: 1 },
              minWidth: { lg: 320 },
              position: { lg: "sticky" },
              top: { lg: "88px" },
              alignSelf: "flex-start",
            }}
          >
            <CourseSidebar
              hasSidebar={true}
              spotsLeft={spotsLeft}
              sessions={ui.sessions}
              datesBySession={ui.datesBySession}
              sessionId={sessionId}
              setSessionId={setSessionId}
              date={date}
              setDate={setDate}
              capacity={ui.maxParticipants ?? 0}
              price={ui.price} // 있으면
              onEnroll={() => {
                // ✅ 1) 비로그인: 로그인 페이지로 보내기
                if (!currentUser) {
                  alert("수강신청을 하려면 로그인이 필요합니다.");

                  // 로그인 페이지 경로는 프로젝트에 맞게 수정 (/login /auth/login 등)
                  navigate("/account/login", {
                    state: {
                      from: location.pathname, // 나중에 되돌아오기용
                    },
                  });
                  return;
                }

                // ✅ 2) 로그인 되어있으면 모달 오픈
                setEnrollOpen(true);
              }}
            />
          </Box>
        </Box>

        {/* ✅ 수강신청 모달 */}
        <EnrollModal
          open={enrollOpen}
          onClose={() => setEnrollOpen(false)}
          course={ui}
          courseId={courseId}
          sessionId={sessionId}
          date={date}
          user={currentUser}
          onSuccess={() => {
            setEnrollOpen(false);
            // 여기서는 "신청 접수"까지만, 잔여석은 시설 측 승인 후에 줄어들게 설계한 상태
          }}
        />
      </Container>
    </Layout>
  );
}
