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
    Grid,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    deleteCommunity,
    deleteCommunityPost,
    fetchAllPost,
    getCommunityMeta,
    getEditPost,
    updateCommunityMeta,
    updateCommunityPost,
} from "../../api/communityAPI/communityAPI";
import PostManageCard from "./PostManageCard";
import { useNavigate } from "react-router-dom";
import { NormalModal, NormalModalExpand } from "../common/Modals";
import { SubTitle } from "../common/Text";
import { OneAlignedButton } from "../common/Button";
import EditPostModal from "./EditPostModal";
import MetaEditField from "../../component/community/MetaEditField";
import { RegisterTitle } from "./RegisterTitle";
import { formattedDate } from "./utility/communityUtility";
import { CalendarCheck, ClipboardList } from "lucide-react";

const InfoRow = ({ label, value, isSecondary = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    return (
        <Typography
            fontSize="1.1rem"
            mb={isMobile || isTablet ? 1 : 3}
            color={
                isSecondary
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary
            }
        >
            <strong>{label}:</strong> {value ?? "-"}
        </Typography>
    );
};

const CommunityPostManage = ({ communityId }) => {
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    //게시물 목록 저장.
    const [meta, setMeta] = useState([]);
    const [editOpen, setIsEditOpen] = useState(false);

    //의사 확인 팝업 제어.
    const [confirmOpen, setConfirmOpen] = useState(false);

    //백엔드 제출 데이터 프론트 기대 구조로 변경(특히 스케쥴 상세 부분).
    const parseCommunityMeta = (meta) => {
        const {
            communityId,
            name,
            purpose,
            maxMember,
            currentMember,
            founder,
            createdAt,
            scheduleType,
            scheduleDetail,
            address,
            addressDetail,
        } = meta;

        let selectedWeeks = [];
        let selectedDays = [];
        let customDate = "";
        let formattedSchedule = scheduleDetail;
        if (scheduleType === "OCCASIONAL") {
            customDate = scheduleDetail;
        } else if (scheduleType === "PERIODICAL" && scheduleDetail) {
            //(매주/격주/매월/격월) 분리.
            const weekMatch = scheduleDetail.match(/^(매주|격주|매월|격월)/);
            if (weekMatch) selectedWeeks.push(weekMatch[0]);

            // 요일 부분 추출.
            const daysString = scheduleDetail.replace(
                /^(매주|격주|매월|격월)\s*/,
                ""
            );
            selectedDays = daysString.split(/[,、 ]+/).filter(Boolean);
        }

        return {
            communityId,
            name,
            purpose,
            maxMember,
            currentMember,
            founder,
            createdAt,
            formattedSchedule,
            scheduleType,
            address,
            addressDetail,
            selectedWeeks,
            selectedDays,
            customDate,
        };
    };

    const loadData = async () => {
        try {
            const data = await getCommunityMeta(communityId);
            setMeta(parseCommunityMeta(data));
        } catch (e) {
            console.error("메타 정보 불러오기 실패:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [communityId]);

    const openDeleteConfirm = () => {
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteCommunity(communityId);
            setConfirmOpen(false);
            // 페이지 "전체" 다시 불러오기.
            window.location.reload();
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
            {editOpen ? (
                <MetaEditField
                    meta={meta}
                    setMeta={setMeta}
                    setOpen={(open) => setIsEditOpen(open)}
                    onSubmit={async (edited) => {
                        await updateCommunityMeta(communityId, edited);
                        await loadData();
                        setIsEditOpen(false);
                    }}
                />
            ) : (
                <>
                    <Grid container size={12}>
                        <Grid
                            item
                            size={isMobile || isTablet ? 12 : 6}
                            sx={{ p: isMobile || isTablet ? 4 : 6 }}
                        >
                            <SubTitle
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: isMobile || isTablet ? 2 : 6,
                                }}
                            >
                                <ClipboardList
                                    color={theme.palette.primary.main}
                                />
                                기본 정보
                            </SubTitle>
                            <InfoRow
                                label={"설립자 이름"}
                                value={meta.founder}
                            />
                            <InfoRow label={"동아리 이름"} value={meta.name} />
                            <InfoRow
                                label={"설립 목적 및 취지"}
                                value={meta.purpose}
                            />
                            <InfoRow
                                label={"최대 모집 인원"}
                                value={meta.maxMember}
                            />{" "}
                            <InfoRow
                                label={"현재 회원 인원"}
                                value={meta.currentMember}
                            />
                        </Grid>

                        <Grid
                            item
                            size={isMobile || isTablet ? 12 : 6}
                            sx={{ p: isMobile || isTablet ? 4 : 6 }}
                        >
                            <SubTitle
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: isMobile || isTablet ? 2 : 6,
                                }}
                            >
                                <CalendarCheck
                                    color={theme.palette.primary.main}
                                />
                                활동 정보
                            </SubTitle>
                            <InfoRow label={"기본 주소"} value={meta.address} />
                            <InfoRow
                                label={"상세 주소"}
                                value={meta.addressDetail}
                            />
                            <InfoRow
                                label={"활동 주기"}
                                value={
                                    meta.scheduleType === "PERIODICAL"
                                        ? "정기적 일정"
                                        : "비정기적 일정"
                                }
                            />
                            <InfoRow
                                label={"활동 주기 상세"}
                                value={meta.formattedSchedule}
                            />
                            <InfoRow
                                label={"최초 등록일"}
                                isSecondary={true}
                                value={formattedDate(meta.createdAt)}
                            />
                        </Grid>

                        <Grid
                            item
                            size={12}
                            sx={{ px: isMobile || isTablet ? 4 : 6 }}
                            justifySelf={"flex-end"}
                        >
                            <Divider sx={{ mb: 4 }} />
                            <Stack
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                            >
                                <OneAlignedButton
                                    align={"right"}
                                    buttonWrapperSx={{
                                        width: "15%",
                                    }}
                                    onClick={openDeleteConfirm}
                                    buttonSx={{ borderRadius: "5px" }}
                                    children={"동아리 삭제"}
                                />
                                <OneAlignedButton
                                    align={"right"}
                                    buttonWrapperSx={{
                                        width: "15%",
                                    }}
                                    onClick={() => setIsEditOpen(true)}
                                    buttonSx={{ borderRadius: "5px" }}
                                    children={"기본 정보 수정"}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
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
                                <strong>{meta.name}</strong> 동아리를 삭제하시겠습니까?
                            </Typography>
                            <Typography
                                fontSize="0.9rem"
                                sx={{
                                    mb: 2,
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                * 회원 및 게시물을 포함한 모든 동아리 데이터가 삭제되며
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
        </Paper>
    );
};
export default CommunityPostManage;
