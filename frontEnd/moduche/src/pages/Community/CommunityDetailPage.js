import { useEffect, useState } from "react";
import { Toolbar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PostDetailComponent from "../../component/community/PostDetailComponent";

import {
    fetchCommunityPostDetail,
    fetchCommunityPostComments,
} from "../../api/communityAPI/communityAPI";

const CommunityDetailPage = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();

    // 상태 정의
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 게시글 상세 조회
    const loadPostDetail = async () => {
        try {
            const data = await fetchCommunityPostDetail(postId, true);
            setPost(data);
        } catch (err) {
            console.error("게시물 정보를 불러오지 못했습니다:", err);
            alert("게시물 정보를 불러오지 못했습니다.");
            navigate("/community"); // 예외 시 목록으로 이동
        }
    };

    console.log(post);
    // 댓글 목록 조회
    const loadComments = async (pageNum = 0) => {
        try {
            setLoading(true);
            const data = await fetchCommunityPostComments(postId, pageNum, 10);
            if (pageNum === 0) {
                setComments(data.content);
            } else {
                setComments((prev) => [...prev, ...data.content]);
            }
            setHasMore(!data.last);
            setPage(data.number);
        } catch (err) {
            console.error("댓글 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    // 마운트 시 게시글 + 댓글 1페이지 불러오기
    useEffect(() => {
        if (postId) {
            loadPostDetail();
            loadComments(0);
        }
    }, [postId]);

    // 댓글 더보기 버튼 클릭
    const handleLoadMoreComments = () => {
        if (!loading && hasMore) {
            loadComments(page + 1);
        }
    };

    return (
        <>
            {post ? (
                <PostDetailComponent
                    data={post}
                    comments={comments}
                    onLoadMoreComments={handleLoadMoreComments}
                    hasMore={hasMore}
                    loading={loading}

                />
            ) : (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                    로딩 중...
                </p>
            )}
        </>
    );
};

export default CommunityDetailPage;
