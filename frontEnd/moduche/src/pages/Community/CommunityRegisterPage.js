import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CommunityRegisterFields } from "../../component/community/CommunityRegisterFields";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { registerCommunity } from "../../api/communityAPI/communityAPI";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../component/community/ConfirmModal";

const CommunityRegisterPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState("안내");
    const [modalContent, setModalContent] = useState("내용");
    const [modalEvent, setModalEvent] = useState(() => {});

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

        // 동아리 이름 검사.
        if (!form.name || form.name.trim().length > 30) {
            setModalTitle("입력 오류");
            setModalContent("동아리 이름은 30자 이내로 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 설립 목적 검사.
        if (!form.purpose || form.purpose.trim().length > 30) {
            setModalTitle("입력 오류");
            setModalContent("설립 목적 및 취지는 30자 이내로 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 활동 위치 검사.
        if (!form.address || !form.addressDetail) {
            setModalTitle("입력 누락");
            setModalContent("활동 위치 및 상세 위치를 모두 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 활동 일정 상세 검사.
        const scheduleDetail =
            form.scheduleType === "정기"
                ? `${form.selectedWeeks.join(", ")} ${form.selectedDays.join(
                      ", "
                  )}`
                : form.customDate;

        if (!scheduleDetail || scheduleDetail.trim() === "") {
            setModalTitle("입력 누락");
            setModalContent("활동 일정 상세를 반드시 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 제목 길이 검사.
        if (!form.title || form.title.trim().length > 30) {
            setModalTitle("입력 오류");
            setModalContent("홍보글 제목은 30자 이내로 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 해시태그 검사.
        if (!form.hashtags || form.hashtags.length === 0) {
            setModalTitle("입력 누락");
            setModalContent("해시태그를 하나 이상 입력해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 이미지 검사.
        if (
            !form.representativeImage &&
            (!form.images || form.images.length === 0)
        ) {
            setModalTitle("입력 누락");
            setModalContent(
                "대표 이미지 또는 활동 이미지를 최소 1개 이상 업로드해주세요."
            );
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
            return;
        }

        // 해시태그 문자열 가공.
        const processedTags = Array.isArray(form.hashtags)
            ? form.hashtags.map((tag) => tag.replace(/^#/, "")).join(" ")
            : form.hashtags;

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

        form.images.forEach((img) => {
            if (img.file) {
                formData.append("images", img.file);
            }
        });

        // API 호출.
        try {
            const res = await registerCommunity(formData);
            setModalTitle("등록 완료");
            setModalContent("동아리 등록 요청이 정상적으로 제출되었습니다.");
            setModalEvent(() => () => {
                setOpenConfirm(false);
                navigate("/community/home");
            });
            setOpenConfirm(true);
        } catch (err) {
            setModalTitle("등록 실패");
            setModalContent("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
            setModalEvent(() => () => setOpenConfirm(false));
            setOpenConfirm(true);
        }
    };

    return (
        <>
            <Grid size={isMobile || isTablet ? 0 : 2} />
            <Grid size={isMobile || isTablet ? 12 : 8}>
                <RegisterFormBase
                    type={"COMMUNITY"}
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

                <ConfirmModal
                    open={openConfirm}
                    title={modalTitle}
                    content={modalContent}
                    onConfirm={modalEvent}
                    onClose={() => setOpenConfirm(false)}
                />
            </Grid>

            <Grid size={isMobile || isTablet ? 0 : 2} />
        </>
    );
};

export default CommunityRegisterPage;
