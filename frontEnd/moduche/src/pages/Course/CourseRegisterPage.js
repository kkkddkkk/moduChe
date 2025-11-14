// src/pages/Course/CourseRegisterPage.jsx
import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CourseRegisterFields } from "../../component/community/CourseRegisterFields";
import { useTheme } from "@emotion/react";
import { Grid, useMediaQuery } from "@mui/material";
import { createCourse } from "../../api/courseAPI";
import { useNavigate } from "react-router-dom";

const CourseRegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    facility: "",
    maxParticipants: "",
    format: "",
    courseType: "",
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

    try {
      // 백엔드 DTO 필드에 맞춰 매핑
      const payload = {
        title: form.name,
        summary: form.description.slice(0, 80), // 일단 앞 80글자 정도 summary로
        description: form.description,
        maxParticipants: Number(form.maxParticipants || 0),
        format: form.format || "OFFLINE",
        courseType: form.courseType,
        // 나중에 facilityId / disabilityType 등 추가
      };

      const saved = await createCourse(payload); // ✅ await 사용
      console.log("created course:", saved);

      alert("강좌가 등록되었습니다.");
      navigate("/course"); // ✅ 목록 페이지로 이동
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
