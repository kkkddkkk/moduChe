import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CourseRegisterFields } from "../../component/community/CourseRegisterFields";
import { useTheme } from "@emotion/react";
import { Grid, useMediaQuery } from "@mui/material";

const CourseRegisterPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

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
