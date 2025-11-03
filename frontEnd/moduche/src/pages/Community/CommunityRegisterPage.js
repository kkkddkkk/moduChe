import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CommunityRegisterFields } from "../../component/community/CommunityRegisterFields";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { registerCommunity } from "../../api/communityAPI/communityAPI";
import { useNavigate } from "react-router-dom";

const CommunityRegisterPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const [form, setForm] = useState({
        // 기본 정보
        name: "",
        founder: "",
        description: "",
        maxMember: 0,

        // 홍보글
        title: "",
        content: "",

        // 미디어 / 태그
        hashtags: [],
        representativeImage: null,
        images: [],

        // 활동 관련
        address: "",
        addressDetail: "",
        scheduleType: "비정기",
        selectedDays: [],
        selectedWeeks: [],
        customDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            images: prev.images,
            representativeImage: prev.representativeImage,
        }));
    };

    const handleImageUpload = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 해시태그 문자열 가공.
        const processedTags = Array.isArray(form.hashtags)
            ? form.hashtags.map((tag) => tag.replace(/^#/, "")).join(" ")
            : form.hashtags;

        // scheduleDetail 문자열 구성.
        const scheduleDetail =
            form.scheduleType === "정기"
                ? `${form.selectedWeeks.join(", ")} ${form.selectedDays.join(
                      ", "
                  )}`
                : form.customDate;

        // SON DTO 생성.
        const dto = {
            address: form.address,
            addressDetail: form.addressDetail,
            title: form.title,
            content: form.content,
            hashTags: processedTags,
            founder: form.founder,
            name: form.name,
            purpose: form.purpose,
            maxMember: Number(form.maxMember),
            scheduleType:
                form.scheduleType === "정기" ? "PERIODICAL" : "OCCASIONAL",
            scheduleDetail,
        };

        // multipart/form-data 구성.
        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify(dto)], { type: "application/json" })
        );

        if (form.representativeImage)
            formData.append("representativeImage", form.representativeImage);

        if (form.images?.length > 0) {
            form.images.forEach((img) => formData.append("images", img));
        }

        console.log("최종 전송 FormData:", dto);

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // API 호출.
        try {
            const res = await registerCommunity(formData);
            console.log("서버 응답:", res);
            navigate("/community/home"); //임시.
        } catch (err) {
            console.error("등록 실패:", err);
            alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
                    title="동아리 등록 신청"
                    extraFields={
                        <CommunityRegisterFields
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

export default CommunityRegisterPage;
