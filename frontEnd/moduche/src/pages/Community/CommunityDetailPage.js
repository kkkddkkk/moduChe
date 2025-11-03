import { Toolbar } from "@mui/material";
import PostDetailComponent from "../../component/community/PostDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

const CommunityDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //더미 데이터.
    const club = {
        id,
        name: `날아라 붉은 해파리 ${id}`,
        address: '경기도 광명시',
        addressDetail: '안양천 고가차도 아래',
        title: '사랑과 낭만을 쫓는 사낭쫓에서 18기 회원을 모집합니다',
        content: '이 동아리는 매주 아침에 함께 운동을 하며 건강과 친목을 도모하는 모임입니다. 함께 참여하실 분을 기다립니다!',
        hashTags: '사랑 인연 낭만 회춘 운명 반려자 건전',
        maxMember: 58,
        purpose: '인류 보존과 악의 세력 척결을 위함',
        scheduleType: 'OCCASIONAL',
        scheduleDetail: '때가 되면 단체 연락 드립니다.',
        createdAt: "2025-10-19",
        founder: "고주임",
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