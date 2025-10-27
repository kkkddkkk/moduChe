import { useState } from "react";
import RegisterFormBase from "../../component/common/RegisterFormBase";
import { CommunityRegisterFields } from "../../component/community/CommunityRegisterFields";
import { Grid } from "lucide-react";

const CommunityRegisterPage = () => {
    const [form, setForm] = useState({
        name: "",
        founder: "",
        purpose: "",
        description: "",
        image: null,
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
        console.log("Community form:", form);
    };

    return (
        <>
            <RegisterFormBase
                form={form}
                onChange={handleChange}
                onImageUpload={handleImageUpload}
                onSubmit={handleSubmit}
                title="새로운 동아리 등록 신청"
                extraFields={
                    <CommunityRegisterFields
                        form={form}
                        onChange={handleChange}
                    />
                }
            />
            {/* <Grid size={2} />
            <Grid size={8}></Grid>

            <Grid size={2} /> */}
        </>
    );
};

export default CommunityRegisterPage;
