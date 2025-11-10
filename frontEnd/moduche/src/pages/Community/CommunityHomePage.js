import { Toolbar } from "@mui/material";
import HomeComponent from "../../component/community/HomeComponent";
import Loading from "../../component/common/Loading";
import { useEffect, useState } from "react";
import { fetchCommunityList } from "../../api/communityAPI/communityAPI";

const CommunityHomePage = () => {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1); // Pagination은 1부터 시작하니까
    const size = 12;

    useEffect(() => {
        const load = async () => {
            try {
                const result = await fetchCommunityList(page - 1, size); // 서버는 0-index
                setData(result);
            } catch (e) {
                console.error("동아리 목록 조회 실패:", e);
            }
        };
        load();
    }, [page]);

    if (!data) return <Loading />;

    return (
        <>
            <HomeComponent
                posts={data.content}
                totalPages={data.totalPages}
                page={page}
                setPage={setPage}
            />
        </>
    );
};
export default CommunityHomePage;
