import communityHttp from "./communityHttp"; 

//---------------[동아리 COMMUNITY].

//동아리 + 동아리 게시물 "등록".
export const registerCommunity = async (formData) => {
  try {
    const response = await communityHttp.post(
      "/community",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("동아리 등록 실패:", error);
    throw error;
  }
};


//---------------[게시물 COMMUNITY POST].

//동아리 게시물 "목록 조회".
export const fetchCommunityList = async (page = 0, size = 12) => {
  try {
    const response = await communityHttp.get("/community-post/list", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("동아리 목록 조회 실패:", error);
    throw error;
  }
};

//단일 게시물 "상세 조회".
export const fetchCommunityPostDetail = async (postId, withSignedUrls = true) => {
  try {
    const response = await communityHttp.get(`/community-post/${postId}`, {
      params: { withSignedUrls },
    });
    return response.data;
  } catch (error) {
    console.error(`게시물 상세 조회 실패 (postId: ${postId}):`, error);
    throw error;
  }
};

//단일 게시물의 "댓글 목록 조회" (페이지네이션).
export const fetchCommunityPostComments = async (postId, page = 0, size = 10) => {
  try {
    const response = await communityHttp.get(`/community-post/${postId}/comments`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error(`댓글 목록 조회 실패 (postId: ${postId}):`, error);
    throw error;
  }
};