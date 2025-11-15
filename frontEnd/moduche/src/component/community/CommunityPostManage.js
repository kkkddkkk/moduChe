import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Stack,
    Pagination,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    deleteCommunityPost,
    fetchAllPost,
    getEditPost,
    updateCommunityPost,
} from "../../api/communityAPI/communityAPI";
import PostManageCard from "./PostManageCard";
import { useNavigate } from "react-router-dom";
import { NormalModal, NormalModalExpand } from "../common/Modals";
import { SubTitle } from "../common/Text";
import { OneAlignedButton } from "../common/Button";
import EditPostModal from "./EditPostModal";
import { extractKeyFromUrl } from "./utility/communityUtility";

const CommunityPostManage = ({ communityId }) => {
    const navigate = useNavigate();
    //게시물 목록 저장.
    const [post, setPost] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    //의사 확인 팝업 제어.
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);

    //검색어 설정 멫 페이징 변수.
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    //이미지 원본.
    const [originalImages, setOriginalImages] = useState([]);

    const [form, setForm] = useState({
        title: "",
        content: "",
        hashTags: "",
        images: [],
    });

    const getTags = (rawTags) => {
        const newTags = rawTags
            .replace(/,/g, " ") //공백으로 통일
            .split(/\s+/) //공백 분리
            .map((tag) => tag.trim()) //앞뒤 공백 제거
            .filter((tag) => tag.length > 0) //빈 문자열 제거
            .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

        return newTags;
    };

    const loadData = async () => {
        try {
            // 실제 API 호출
            const data = await fetchAllPost(communityId, page - 1, 5, search);
            // 정상 응답인 경우
            if (
                data &&
                data.content &&
                Array.isArray(data.content) &&
                data.content.length >= 0
            ) {
                setPost(data.content);
                setTotalPages(data.totalPages);
                return;
            }
        } catch (e) {
            console.error("가입 요청 조회 실패:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [communityId, search, page]);

    const openConfirm = (post) => {
        setSelectedPost(post);
        setConfirmOpen(true);
    };

    const openEditModal = async (post) => {
        try {
            setSelectedPost(post);

            const data = await getEditPost(post.postId);

            //form.images를 "객체 배열"로 통일
            const normalizedImages = (data.existingImages || []).map((url) => ({
                file: null,
                url, // presigned URL 그대로
            }));

            setForm({
                title: data.title,
                content: data.content,
                hashtags: getTags(data.hashTags),
                images: normalizedImages,
            });

            //삭제 계산용으로만 쓰는 원본 URL 배열
            setOriginalImages(data.existingImages || []);

            setEditOpen(true);
        } catch (err) {
            console.error(err);
        }
    };
    const handleUpdate = async () => {
        // 기존 이미지 URL (이미 업로드된 이미지들)
        const existing = originalImages; // 기존 이미지들
        console.log("기존 이미지:", existing);

        // 현재 상태 이미지 (업데이트된 이미지들)
        const current = form.images; // 현재 상태 (업데이트된 이미지들)
        console.log("업데이트된 이미지:", current);

        // 삭제할 이미지 목록 계산
        const deletePhotos = existing
            .map(extractKeyFromUrl) // 기존 이미지에서 key 추출
            .filter(
                (
                    key // 기존 이미지 목록에 있지만, 현재 상태에는 없는 것들만 삭제
                ) =>
                    !current.some(
                        (img) =>
                            typeof img.url === "string" &&
                            extractKeyFromUrl(img.url) === key
                    )
            );
        console.log("삭제할 기존 이미지:", deletePhotos);

        // 새로 업로드된 파일만 추출 (file이 null이 아닌 항목만 필터링)
        const newFiles = current.filter((img) => img.file !== null);
        console.log("새 업로드 이미지:", newFiles);

        // FormData 만들기
        const formData = new FormData();

        // JSON DTO 추가 (삭제할 이미지 목록 포함)
        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
                        title: form.title,
                        content: form.content,
                        hashTags: form.hashtags.join(" "),
                        deletePhotos: deletePhotos, // 삭제할 이미지 목록
                    }),
                ],
                { type: "application/json" }
            )
        );

        // 새 파일 추가 (새로 업로드된 파일들)
        newFiles.forEach((img) => {
            formData.append("newImages", img.file); // 파일 객체 추가
        });

        try {
            // 서버에 요청을 보내고, 처리 후 상태 갱신
            await updateCommunityPost(
                communityId,
                selectedPost.postId,
                formData
            );
            setEditOpen(false);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCommunityPost(communityId, selectedPost.postId);

            setConfirmOpen(false);

            // 새로고침
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Paper
            sx={{
                p: 3,
                minHeight: "560px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                    <TextField
                        placeholder="게시물 이름 검색"
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>
            </Box>
            {post?.length === 0 ? (
                <>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary",
                            fontSize: "1.1rem",
                        }}
                    >
                        아직 등록 된 게시물이 없습니다.
                    </Box>
                </>
            ) : (
                <>
                    {/* 카드 리스트 */}
                    <Stack spacing={2} sx={{ flex: 1 }}>
                        {post.map((post) => (
                            <PostManageCard
                                key={post.postId}
                                post={post}
                                onDelete={(p) => {
                                    openConfirm(p);
                                }}
                                onEdit={(p) => {
                                    openEditModal(p);
                                }}
                            />
                        ))}
                    </Stack>

                    {/* 페이지네이션 */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, v) => setPage(v)}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            <NormalModal
                open={confirmOpen}
                close={() => setConfirmOpen(false)}
                title={<SubTitle>동아리 영구 삭제</SubTitle>}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        p: 1,
                        pt: 0,
                    }}
                >
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                flex: 1,
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ mt: 4, mb: 1 }}>
                                해당 게시물을 삭제하시겠습니까?
                            </Typography>
                            <Typography
                                fontSize="0.9rem"
                                sx={{
                                    mb: 2,
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                * 사진 및 댓글을 포함한 모든 데이터가 삭제되며
                                복구할 수 없습니다.
                            </Typography>
                        </Box>
                    </>
                    <Divider sx={{ mt: 9 }} />

                    <Stack
                        direction={"row"}
                        sx={{
                            display: "flex",
                            width: "100%",
                            mt: 3,
                            justifyContent: "space-between",
                        }}
                    >
                        <OneAlignedButton
                            variant="outlined"
                            sx={{
                                height: "48px",
                                width: "100%",
                                borderRadius: "5px",
                            }}
                            buttonWrapperSx={{ width: "95%" }}
                            onClick={() => setConfirmOpen(false)}
                        >
                            취소
                        </OneAlignedButton>

                        <OneAlignedButton
                            variant="contained"
                            sx={{
                                height: "48px",
                                width: "100%",
                                borderRadius: "5px",
                            }}
                            buttonWrapperSx={{ width: "95%" }}
                            onClick={handleDelete}
                        >
                            확인
                        </OneAlignedButton>
                    </Stack>
                </Box>
            </NormalModal>
            <EditPostModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                form={form}
                setForm={setForm}
                onSubmit={handleUpdate}
                originalImages={originalImages}
            />
        </Paper>
    );
};
export default CommunityPostManage;
