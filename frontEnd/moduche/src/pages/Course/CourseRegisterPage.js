// src/pages/Course/CourseRegisterPage.js

import { useEffect, useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CourseRegisterFields } from "../../component/community/CourseRegisterFields";
import { useTheme } from "@emotion/react";
import { Grid, useMediaQuery } from "@mui/material";
import { createCourse } from "../../api/courseAPI";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, isTokenExpired } from "../../utils/auth";

// 🔥 내 시설 정보 가져오는 API
import { fetchMyFacility } from "../../api/facilityAPI";

const CourseRegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  // ✅ 시설 정보 (읽기 전용)
  const [facility, setFacility] = useState(null);

  // ✅ 강좌 등록 폼 상태
  const [form, setForm] = useState({
    // 기본 정보
    title: "",
    content: "",
    images: [], // 🖼️ 여러 이미지를 위해 배열로 변경

    // 시설 정보 (내 시설 기준)
    facilityId: null,
    facilityName: "",
    facilityAddress: "",

    // 강좌 설정
    maxParticipants: "",
    format: "OFFLINE",
    courseType: "",

    // 운영주기
    scheduleType: "정기",
    selectedDays: [],
    selectedWeeks: [],
    weekFrequency: "매주",
    customDate: "",
    operationSchedule: "",

    // 세션 기간/시간
    sessionStartDate: "",
    sessionEndDate: "",
    sessionStartTime: "",
    sessionEndTime: "",

    // 해시태그
    hashtags: [],

    // 🔥 실제 활동 장소(외부 시설 포함)
    activityPlaceName: "",
    activityAddress: "",
    activityAddressDetail: "",
    activityGeoLat: null,
    activityGeoLng: null,
  });

  // ✅ 로그인/토큰 체크
  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/account/login");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      navigate("/account/login");
      return;
    }
  }, [navigate]);

  // ✅ 내 시설 정보를 한 번만 불러와서 form 기본값으로 세팅
  useEffect(() => {
    const loadMyFacility = async () => {
      try {
        const data = await fetchMyFacility();
        // data 는 FacilityDto
        // { facilityId, facilityName, facilityAddress, geoLat, geoLng, ... }

        setFacility(data);

        setForm((prev) => ({
          ...prev,
          facilityId: data.facilityId,
          facilityName: data.facilityName,
          facilityAddress: data.facilityAddress,
          // 활동 위치 기본값도 시설 주소로 깔아두고, 사용자가 바꾸게 할 수 있음
          activityPlaceName: prev.activityPlaceName || data.facilityName,
          activityAddress: prev.activityAddress || data.facilityAddress,
          activityGeoLat: prev.activityGeoLat ?? data.geoLat,
          activityGeoLng: prev.activityGeoLng ?? data.geoLng,
        }));
      } catch (e) {
        console.error("내 시설 정보 조회 실패:", e);
        if (e.response?.status === 403) {
          alert(
            "시설 정보에 접근할 수 없습니다. 권한 또는 로그인 상태를 확인해주세요."
          );
        }
      }
    };

    loadMyFacility();
  }, []);

  // 공통 input 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // HTML → 순수 텍스트 추출용
  const stripHtml = (html) =>
    html
      ? html
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim()
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================== 공통 유틸 ==================
    const trim = (v) => (v ?? "").toString().trim();

    const focusByName = (name) => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el && typeof el.focus === "function") {
        el.focus();
      }
    };

    const parseDate = (v) => (v ? new Date(v) : null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ================== 1) 필수값 검증 + 포커스 ==================

    // 시설
    if (!form.facilityId) {
      alert("시설 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 제목
    if (!trim(form.title)) {
      alert("강좌명을 입력해 주세요.");
      focusByName("title");
      return;
    }

    // 내용
    if (!trim(form.content)) {
      alert("강좌 설명을 입력해 주세요.");
      focusByName("content");
      return;
    }

    // 최대 인원
    if (!trim(form.maxParticipants) || Number(form.maxParticipants) <= 0) {
      alert("최대 모집 인원을 1명 이상 입력해 주세요.");
      focusByName("maxParticipants");
      return;
    }

    // 진행 방식
    if (!trim(form.format)) {
      alert("진행 방식을 입력해 주세요. (OFFLINE / ONLINE / HYBRID)");
      focusByName("format");
      return;
    }

    // 강좌 타입 (프리 텍스트)
    if (!trim(form.courseType)) {
      alert("강좌 타입(예: 태권도, 요가 등)을 입력해 주세요.");
      focusByName("courseType");
      return;
    }

    // 실제 활동 주소
    if (!trim(form.activityAddress)) {
      alert("실제 활동 주소를 선택해 주세요.");
      // SearchMap 안이라 name 없을 수 있어서 포커스는 생략
      return;
    }

    // ================== 2) 운영 주기 / 세션 검증 ==================
    const scheduleType = form.scheduleType || "정기";

    if (scheduleType === "정기") {
      // 날짜/시간
      if (!trim(form.sessionStartDate)) {
        alert("세션 시작일을 선택해 주세요.");
        focusByName("sessionStartDate");
        return;
      }
      if (!trim(form.sessionEndDate)) {
        alert("세션 종료일을 선택해 주세요.");
        focusByName("sessionEndDate");
        return;
      }
      if (!trim(form.sessionStartTime)) {
        alert("시작 시간을 선택해 주세요.");
        focusByName("sessionStartTime");
        return;
      }
      if (!trim(form.sessionEndTime)) {
        alert("종료 시간을 선택해 주세요.");
        focusByName("sessionEndTime");
        return;
      }

      const startDate = parseDate(form.sessionStartDate);
      const endDate = parseDate(form.sessionEndDate);

      // 오늘 이전 날짜 금지
      if (startDate && startDate < today) {
        alert("세션 시작일은 오늘 이후만 선택할 수 있습니다.");
        focusByName("sessionStartDate");
        return;
      }
      if (endDate && endDate < today) {
        alert("세션 종료일은 오늘 이후만 선택할 수 있습니다.");
        focusByName("sessionEndDate");
        return;
      }

      // 종료 >= 시작
      if (startDate && endDate && endDate < startDate) {
        alert("세션 종료일은 시작일 이후여야 합니다.");
        focusByName("sessionEndDate");
        return;
      }

      // 요일 선택
      if (!form.selectedDays || form.selectedDays.length === 0) {
        alert("정기 강좌의 경우 요일을 하나 이상 선택해 주세요.");
        // 요일 버튼은 이름이 없어서 포커스는 생략
        return;
      }
    } else if (scheduleType === "비정기") {
      if (!trim(form.operationSchedule)) {
        alert("비정기 강좌는 활동 일정 설명을 입력해 주세요.");
        // CustomTextField라 name이 없을 수 있어서 포커스 생략
        return;
      }
    }

    // ================== 3) DTO 만들기 (기존 로직 유지) ==================
    const dto = {
      title: form.title,
      summary: form.summary || stripHtml(form.content).slice(0, 80),
      description: form.content,
      maxParticipants: Number(form.maxParticipants || 0),
      format: form.format || "OFFLINE",
      status: "PUBLISHED",
      typeCode: form.courseType || null,
      facilityId: form.facilityId,

      // 운영주기
      scheduleType: form.scheduleType,
      weekFrequency: form.weekFrequency,
      days: form.selectedDays,
      operationSchedule: form.operationSchedule || null,

      instructorName: form.instructor || null,

      // 세션 기간/시간
      sessionStartDate: form.sessionStartDate || null,
      sessionEndDate: form.sessionEndDate || null,
      sessionStartTime: form.sessionStartTime || null,
      sessionEndTime: form.sessionEndTime || null,

      // 해시태그
      hashtags: (form.hashtags || []).map((tag) => tag.replace(/^#/, "")),

      // 🔥 실제 활동 위치
      activityPlaceName: form.activityPlaceName || form.facilityName || null,
      activityAddress: form.activityAddress || form.facilityAddress || null,
      activityAddressDetail: form.activityAddressDetail || null,
      activityGeoLat: form.activityGeoLat,
      activityGeoLng: form.activityGeoLng,
    };

    // ================== 4) FormData 구성 + 서버 전송 ==================
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    // 🖼️ 동호회 등록과 동일하게 여러 이미지 파일 추가
    if (form.images && form.images.length > 0) {
      form.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });
    }

    try {
      await createCourse(formData);
      alert("강좌 등록이 완료되었습니다.");
      navigate("/course");
    } catch (err) {
      console.error("강좌 등록 실패:", err);
      alert("강좌 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Grid size={isMobile || isTablet ? 0 : 2} />
      <Grid size={isMobile || isTablet ? 12 : 8}>
        <RegisterFormBase
          form={form}
          setForm={setForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
          title="강좌 등록 신청"
          extraFields={
            <CourseRegisterFields
              form={form}
              setForm={setForm}
              onChange={handleChange}
              facility={facility} // ✅ 시설 정보 전달
              setFacility={setFacility}
            />
          }
        />
      </Grid>
      <Grid size={isMobile || isTablet ? 0 : 2} />
    </>
  );
};

export default CourseRegisterPage;
