import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDetailComponent from "../../component/community/PostDetailComponent";
import {
    fetchCommunityPostDetail,
    fetchCommunityPostComments,
    createCommunityPostComment,
    deleteCommunityPostComment,
} from "../../api/communityAPI/communityAPI";
import { getUsernameFromToken } from "../../utils/auth";
import ConfirmModal from "../../component/community/ConfirmModal";

const CommunityDetailPage = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();

    const currentUser = getUsernameFromToken(
        localStorage.getItem("accessToken")
    );

    //게시글 및 댓글 상태.
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    //확인 팝업.
    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState("안내");
    const [modalContent, setModalContent] = useState("내용");
    const [modalEvent, setModalEvent] = useState(() => {});
    const [targetCommentId, setTargetCommentId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    //게시글 상세 불러오기.
    const loadPostDetail = async () => {
        try {
            const data = await fetchCommunityPostDetail(postId);
            setPost(data);
        } catch (err) {
            console.error("게시글 정보를 불러오지 못했습니다:", err);
            navigate("/community");
        }
    };

    //댓글 목록 불러오기.
    const loadComments = async (reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetchCommunityPostComments(
                postId,
                reset ? 0 : page,
                10
            );
            const newComments = res?.content ?? [];
            setComments((prev) =>
                reset ? newComments : [...prev, ...newComments]
            );
            setHasMore(!res.last);
            setPage((prev) => (reset ? 1 : prev + 1));
        } catch (err) {
            console.error("댓글 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteComment = async (commentId) => {
        if (!commentId || deleting) return;
        setDeleting(true);
        try {
            await deleteCommunityPostComment(commentId, currentUser);
            setComments((prev) =>
                prev.filter((c) => c.commentId !== commentId)
            );
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
            alert("댓글 삭제에 실패했습니다.");
        } finally {
            setDeleting(false);
            setOpenConfirm(false);
            setTargetCommentId(null);
        }
    };
    //댓글 작성.
    const handleSubmitComment = async (userId) => {
        if (!inputValue.trim() || submitting) return;
        setSubmitting(true);
        try {
            const newComment = await createCommunityPostComment(
                postId,
                userId,
                inputValue.trim()
            );
            setComments((prev) => [...prev, newComment]);
            setInputValue("");
        } catch (err) {
            console.error("댓글 작성 실패:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setTargetCommentId(commentId);
        setModalTitle("댓글 삭제");
        setModalContent("해당 댓글을 삭제하시겠습니까?");
        setModalEvent(() => () => confirmDeleteComment(commentId));
        setOpenConfirm(true);
    };

    const handleReportComment = () => {};

    //마운트 시 게시글 + 댓글 1페이지 로드.
    useEffect(() => {
        if (postId) {
            loadPostDetail();
            loadComments(true);
        }
    }, [postId]);

    return post ? (
        <>
            <PostDetailComponent
                data={post}
                comments={comments}
                hasMore={hasMore}
                loading={loading}
                inputValue={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmitComment}
                currentUserId={currentUser}
                onDeleteComment={(id) => handleDeleteComment(id)}
                onReportComment={(id) => handleReportComment(id)}
                onLoadMore={loadComments}
                submitting={submitting}
            />

            <ConfirmModal
                open={openConfirm}
                title={modalTitle}
                content={modalContent}
                onConfirm={modalEvent}
                onClose={() => setOpenConfirm(false)}
            />
        </>
    ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>로딩 중...</p>
    );
};

export default CommunityDetailPage;
