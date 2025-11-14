// src/pages/Course/CourseRegisterPage.jsx
import { useState } from "react";
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

  const [form, setForm] = useState({
    // 기본 정보
    name: "",
    description: "",
    image: null,

    // ✅ 시설 정보
    facilityId: null, // 숫자 PK
    facilityName: "", // 화면 표시용(선택된 시설명)

    // 강좌 설정
    maxParticipants: "",
    format: "", // "OFFLINE" / "ONLINE" 등
    courseType: "", // type_code
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 1) 로그인 확인
    if (!isLoggedIn()) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("account/login");
      return;
    }

    // ✅ 2) 필수값 체크 (시설/제목/내용 등)
    if (!form.facilityId) {
      alert("시설을 선택해 주세요.");
      return;
    }
    if (!form.name.trim()) {
      alert("강좌명을 입력해 주세요.");
      return;
    }
    if (!form.description.trim()) {
      alert("강좌 설명을 입력해 주세요.");
      return;
    }

    try {
      // ✅ 백엔드 DTO 필드에 맞춰 매핑
      const payload = {
        title: form.name,
        summary: form.description.slice(0, 80),
        description: form.description,
        maxParticipants: Number(form.maxParticipants || 0),
        format: form.format || "OFFLINE",
        courseType: form.courseType || null,
        facilityId: form.facilityId, // ✅ 핵심!
      };

      const saved = await createCourse(payload);
      console.log("created course:", saved);

      alert("강좌가 등록되었습니다.");
      navigate("/course");
    } catch (err) {
      console.error("강좌 등록 실패", err);
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
            />
          }
        />
      </Grid>
      <Grid size={isMobile || isTablet ? 0 : 2} />
    </>
  );
};

export default CourseRegisterPage;
