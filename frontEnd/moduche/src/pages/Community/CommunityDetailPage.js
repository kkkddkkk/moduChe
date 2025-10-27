import { Toolbar } from "@mui/material";
import PostDetailComponent from "../../component/community/PostDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

const CommunityDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //더미 데이터.
    const club = {
        id,
        name: `임시 동아리 ${id}`,
        description:
            "이 동아리는 매주 아침에 함께 운동을 하며 건강과 친목을 도모하는 모임입니다. 함께 참여하실 분을 기다립니다!",
        createdAt: "2025-10-19",
        author: "고주임",
        memberCount: 58,
        imageUrl: null,
    };

    return (
        <>
            <PostDetailComponent
                data={club}
            />
        </>
    )
}
export default CommunityDetailPage;