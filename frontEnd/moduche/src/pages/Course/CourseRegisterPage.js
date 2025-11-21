// src/pages/Course/CourseRegisterPage.js

import { useEffect, useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CourseRegisterFields } from "../../component/community/CourseRegisterFields";
import { useTheme } from "@emotion/react";
import { Grid, useMediaQuery } from "@mui/material";
import { createCourse } from "../../api/courseAPI";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const CourseRegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  // ✅ 시설 선택 정보 (FacilityInfo 스타일의 Autocomplete에서 선택된 결과라고 가정)
  const [facility, setFacility] = useState(null);

  // ✅ 강좌 등록 폼 상태
  const [form, setForm] = useState({
    // 기본 정보
    name: "", // 강좌명
    content: "", // 홍보글(강좌 설명) - RichTextEditor에서 채워짐
    image: null, // 대표 이미지 (지금은 백엔드에 안 보냄, 나중에 확장)

    // 시설 정보
    facilityId: null, // 숫자 PK
    facilityName: "", // 화면 표시용(선택된 시설명)

    // 강좌 설정
    maxParticipants: "",
    format: "", // "OFFLINE" / "ONLINE" 등
    courseType: "", // type_code
  });

  // ✅ facility가 선택될 때마다 form에 동기화
  useEffect(() => {
    if (!facility) return;
    setForm((prev) => ({
      ...prev,
      facilityId: facility.id, // 🔥 백엔드에 보낼 PK
      facilityName: facility.name,
      address: facility.loca, // 필요하면 주소도 같이 보여줄 때 사용
    }));
  }, [facility]);

  // 공통 input 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 (지금은 상태만 보관, 나중에 multipart 할 때 사용)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
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

    // 1) 필수값 검증
    if (!form.facilityId) {
      alert("시설을 선택해 주세요.");
      return;
    }
    if (!form.title || !form.title.trim()) {
      alert("강좌명을 입력해 주세요.");
      return;
    }
    if (!form.content || !form.content.trim()) {
      alert("강좌 설명을 입력해 주세요.");
      return;
    }

    // 2) DTO 만들기 (백엔드 CourseCreateRequest에 맞춤)
    const dto = {
      title: form.title,
      summary:
        form.summary || form.content.replace(/<[^>]+>/g, "").slice(0, 80),
      description: form.content, // 🔥 Quill HTML 그대로
      maxParticipants: Number(form.maxParticipants || 0),
      format: form.format || "OFFLINE", // 기본값
      status: "PUBLISHED", // 일단 고정값
      typeCode: form.courseType || null, // 필요 없으면 null
      facilityId: form.facilityId, // 이미 facility 선택에서 세팅된 값
      // creatorUserId는 서버에서 token으로 처리 → 안 보냄
    };

    // 3) FormData 구성 (동호회와 동일 패턴)
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    if (form.images && form.images.length > 0) {
      form.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });
    }

    try {
      const res = await createCourse(formData);
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
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          title="강좌 등록 신청"
          extraFields={
            <CourseRegisterFields
              form={form}
              setForm={setForm}
              onChange={handleChange}
              facility={facility}
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
