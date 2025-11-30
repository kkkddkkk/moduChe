import { Grid, Typography } from "@mui/material";
import BannerApplyForm from "../../component/banner/BannerApplyForm";
import { CenterTitle } from "../../component/common/Text";
import GuestBannerLookupModal from "../../component/banner/GuestBannerLookupModal";
import { useEffect, useState } from "react";
import {
    getGuestBannerList,
    getMemberBannerList,
} from "../../api/bannerAPI/bannerAPI";
import { isLoggedIn } from "../../utils/auth";
import GuestBannerListModal from "../../component/banner/GuestBannerListModal";

const BannerApplyPage = () => {
    const [open, setOpen] = useState(false);
    const [openList, setOpenList] = useState(false);

    const [results, setResults] = useState([]);

    const handleGuestLookup = async (email, guestPassword) => {
        try {
            const list = await getGuestBannerList(email, guestPassword);
            setResults(list);
            setOpen(false);
            setOpenList(true);
        } catch (err) {
            alert("조회 실패 — 이메일 또는 비밀번호를 확인해주세요.");
        }
    };

    const handleCheckResult = async () => {
        const logIn = isLoggedIn();
        console.log("isLoggedIn: " + logIn);
        if (logIn) {
            //회원 조회 API.
            const result = await getMemberBannerList();

            setResults(result);
            setOpenList(true);
        } else {
            //비회원 조회 모달 오픈.
            setOpen(true);
        }
    };

    useEffect(() => {
        console.log("조회 결과");
        console.log(results);
    }, [results]);

    return (
        <>
            <Grid size={3} />
            <Grid size={6}>
                <CenterTitle sx={{ mt: 5, mb: 5 }}>배너 등록 신청</CenterTitle>
                <BannerApplyForm onCheck={handleCheckResult} />
            </Grid>
            <Grid size={3} />
            <GuestBannerLookupModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={(contact, password) =>
                    handleGuestLookup(contact, password)
                }
            />

            <GuestBannerListModal
                open={openList}
                onClose={() => setOpenList(false)}
                results={results}
            />
        </>
    );
};

export default BannerApplyPage;
