import { Toolbar, Box } from "@mui/material";
import HomeComponent from "../../component/community/HomeComponent";
import Loading from "../../component/common/Loading";
import ConfirmModal from "../../component/community/ConfirmModal";
import { useEffect, useState } from "react";
import { fetchCommunityList } from "../../api/communityAPI/communityAPI";
import { isLoggedIn, isTokenExpired } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const CommunityHomePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modalTitle, setModalTitle] = useState("안내");
  const [modalContent, setModalContent] = useState("내용");
  const [modalEvent, setModalEvent] = useState(() => {});

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const size = 12;

  const [searchItems, setSearchItems] = useState(null);
  const [searchTotal, setSearchTotal] = useState(0);
  const [lastSearchPayload, setLastSearchPayload] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      setOpenConfirm(true);
      setModalTitle("잘못된 접근");
      setModalContent(
        "로그인이 필요한 서비스입니다.\n로그인 후 이용하실 수 있습니다."
      );
      setModalEvent(() => () => navigate("/account/login"));
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      setLoading(false);
      setOpenConfirm(true);
      setModalTitle("로그인 만료");
      setModalContent(
        "로그인이 만료 되었습니다.\n재로그인 후 이용하실 수 있습니다."
      );
      setModalEvent(() => () => navigate("/account/login"));
      return;
    }

    const load = async () => {
      try {
        const result = await fetchCommunityList(page - 1, size);
        setData(result);
        setLoading(false);
      } catch (e) {
        console.error("동아리 목록 조회 실패:", e);
        setLoading(false);
      }
    };

    if (!searchItems) {
      load();
    }
  }, [page, navigate, searchItems]);

  const handleQuickSearchResult = (items, total, payload) => {
    const normalized = (items || []).map((item) => ({
      communityId: item.communityId,
      name: item.title,
      purpose: item.summary,
      representativeImage: item.representativeImage,
      createdAt: item.createdAt,
      memberCount: item.memberCount ?? 0,
    }));

    setSearchItems(normalized);
    setSearchTotal(total || 0);
    setLastSearchPayload(payload);
    setPage(1);
  };

  const isSearchMode = !!searchItems;

  const posts = isSearchMode ? searchItems : data?.content || [];
  const totalPages = isSearchMode
    ? Math.max(1, Math.ceil(searchTotal / size))
    : data?.totalPages || 1;

  return (
    <>
      <ConfirmModal
        open={openConfirm}
        title={modalTitle}
        content={modalContent}
        onConfirm={modalEvent}
        isNoEscape={true}
        isOneBtn={true}
        onClose={() => setOpenConfirm(false)}
      />

      {!data && !isSearchMode ? (
        <Loading open={loading} text="동아리 목록을 가져오고 있습니다." />
      ) : (
        <>
          <Toolbar />
          <HomeComponent
            posts={posts}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            onQuickSearchResult={handleQuickSearchResult}
          />
        </>
      )}
    </>
  );
};

export default CommunityHomePage;
