import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDetailComponent from "../../component/community/PostDetailComponent";
import {
  fetchCommunityPostDetail,
  fetchCommunityPostComments,
  createCommunityPostComment,
  deleteCommunityPostComment,
  checkEnrollmentEligibility,
} from "../../api/communityAPI/communityAPI";
import {
  getIdRoleFromToken,
  getUsernameFromToken,
  isLoggedIn,
  isTokenExpired,
} from "../../utils/auth";
import ConfirmModal from "../../component/community/ConfirmModal";
import Loading from "../../component/common/Loading";

const CommunityDetailPage = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const currentUser = getUsernameFromToken(localStorage.getItem("accessToken"));

  const userRole = getIdRoleFromToken(localStorage.getItem("accessToken"));

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
  const [noEscape, setNoEscape] = useState(false);
  const [isOneBtn, setIsOneBtn] = useState(false);
  const [eligible, setEligible] = useState(false);

  //게시글 상세 불러오기.
  const loadPostDetail = async () => {
    try {
      const data = await fetchCommunityPostDetail(postId);
      setPost(data);

      checkEnrollmentEligibility(data.communityId).then((res) => {
        setEligible(res);
      });
    } catch (err) {
      console.error("게시글 정보를 불러오지 못했습니다:", err);
      navigate("/community");
      setLoading(true);
    }
  };

  //댓글 목록 불러오기.
  const loadComments = async (reset = false) => {
    setLoading(true);
    try {
      const res = await fetchCommunityPostComments(
        postId,
        reset ? 0 : page,
        10
      );
      const newComments = res?.content ?? [];
      setComments((prev) => (reset ? newComments : [...prev, ...newComments]));
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
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
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
    setIsOneBtn(false);
    setNoEscape(false);
    setOpenConfirm(true);
  };

  const handleReportComment = () => {};

  //마운트 시 게시글 + 댓글 1페이지 로드.
  useEffect(() => {
    //로그인, 엑세스 토큰 먼저 확인.
    if (!isLoggedIn()) {
      setLoading(false);
      setIsOneBtn(true);
      setNoEscape(true);
      setModalTitle("잘못된 접근");
      setModalContent(
        "로그인이 필요한 서비스입니다.\n로그인 후 이용하실 수 있습니다."
      );
      setModalEvent(() => () => navigate("/account/login"));
      setOpenConfirm(true);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      setLoading(false);
      setIsOneBtn(true);
      setNoEscape(true);
      setModalTitle("로그인 만료");
      setModalContent(
        "로그인이 만료 되었습니다.\n재로그인 후 이용하실 수 있습니다."
      );
      setModalEvent(() => () => navigate("/account/login"));
      setOpenConfirm(true);
      return;
    }

    if (postId) {
      loadPostDetail();
      loadComments(true);
    }
  }, [postId]);

  return (
    <>
      {!post ? (
        <Loading open={loading} text="동아리 상세 정보를 가져오고 있습니다." />
      ) : (
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
          role={userRole}
          eligible={eligible}
        />
      )}

      <ConfirmModal
        open={openConfirm}
        title={modalTitle}
        content={modalContent}
        onConfirm={modalEvent}
        onClose={() => setOpenConfirm(false)}
        isNoEscape={noEscape}
        isOneBtn={isOneBtn}
      />
    </>
  );
};

export default CommunityDetailPage;
