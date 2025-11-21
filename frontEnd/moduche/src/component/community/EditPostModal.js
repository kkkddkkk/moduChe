import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Grid,
    useTheme,
    alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { RegisterTitle } from "./RegisterTitle";
import CustomTextField from "../common/CustomTextField";
import RichTextEditor from "../common/RichTextEditor";
import { HashTagInput } from "../common/HashTagInput";
import { ImageUpload } from "../common/ImageUpload";
import { OneAlignedButton } from "../common/Button";
import communityTemplate from "../community/utility/communityTemplate";
import Paper from "../common/Paper";

const EditPostModal = ({
    open,
    onClose,
    form,
    setForm,
    onSubmitNew,
    onSubmitEdit,
    editMode,
    type = "COMMUNITY",
    originalImages, // 추가된 props
}) => {
    const theme = useTheme();

    const handleInputChange = (value, name) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: 3,
                    maxHeight: "75vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* X 버튼 */}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    zIndex: 10,
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
                {editMode === "NEW_POST" ? "게시물 작성" : "게시물 수정"}
            </DialogTitle>

            {/* 본문 스크롤 영역 */}
            <form
                onSubmit={editMode === "NEW_POST" ? onSubmitNew : onSubmitEdit}
            >
                <DialogContent
                    dividers
                    sx={{
                        overflowY: "auto",
                        pt: 3,
                        pb: 5,
                    }}
                >
                    <>
                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"홍보글 제목"} />
                            <CustomTextField
                                setData={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        title: value,
                                    }))
                                }
                                data={form.title}
                                placeholder={
                                    "예: 사랑과 낭만을 쫓는 사람들의 모임"
                                }
                                padding={10}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"홍보글 내용"} />

                            {/* 리액트 19 호환 퀼 커스텀 컴포넌트로 빼둠 => (이름: RichTextEditor) */}
                            {/* 추가 데코레이션 기능 있으시면 문의 주시면 추가해두겠습니다: 고은설. */}
                            <Box
                                sx={{
                                    backgroundColor:
                                        theme.palette.background.paper,
                                    overflow: "hidden",
                                }}
                            >
                                <RichTextEditor
                                    value={form.content || ""}
                                    onChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            content: value,
                                        }))
                                    }
                                    defaultTemplate={
                                        type === "COMMUNITY"
                                            ? communityTemplate
                                            : null
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"해시태그"} />
                            {/* 해시태그 입력 컴포넌트 */}
                            <HashTagInput form={form} setForm={setForm} />
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <ImageUpload
                                form={form}
                                setForm={setForm}
                                existingImages={originalImages}
                            />
                        </Grid>
                    </>

                    {/* 하단 버튼 */}
                    <DialogActions
                        sx={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "space-between",
                        }}
                    >
                        {editMode === "NEW_POST" ? (
                            <>
                                <OneAlignedButton
                                    variant="contained"
                                    sx={{ width: "90%" }}
                                    onClick={onSubmitNew}
                                    align="center"
                                    buttonWrapperSx={{
                                        width: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    게시물 등록
                                </OneAlignedButton>
                            </>
                        ) : (
                            <>
                                <OneAlignedButton
                                    variant="outlined"
                                    sx={{ width: "90%" }}
                                    onClick={onClose}
                                    buttonWrapperSx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    수정 취소
                                </OneAlignedButton>

                                <OneAlignedButton
                                    variant="contained"
                                    sx={{ width: "90%" }}
                                    onClick={onSubmitEdit}
                                    buttonWrapperSx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    게시물 수정
                                </OneAlignedButton>
                            </>
                        )}
                    </DialogActions>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default EditPostModal;
