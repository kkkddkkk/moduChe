import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CourseRegisterFields } from "../../component/community/CourseRegisterFields";


const CourseRegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    facility: "",
    maxParticipants: "",
    format: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course form:", form);
  };

  return (
    <RegisterFormBase
      form={form}
      onChange={handleChange}
      onImageUpload={handleImageUpload}
      onSubmit={handleSubmit}
      title="새로운 강좌 등록 신청"
      extraFields={<CourseRegisterFields form={form} onChange={handleChange} />}
    />
  );
};

export default CourseRegisterPage;