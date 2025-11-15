import communityHttp from "./communityHttp";

//---------------[동아리 COMMUNITY].
//#region
//동아리 + 동아리 게시물 "등록".
export const registerCommunity = async (formData) => {
    try {
        const response = await communityHttp.post("/community", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("동아리 등록 실패:", error);
        throw error;
    }
};

//동아리 소유주 여부 경량 반환.
export const checkIfOwner = async () => {
    try {
        const response = await communityHttp.get("/community/is-owner");
        return response.data;
    } catch (error) {
        console.error("isOwner 확인 실패:", error);
        return false;
    }
};

//해당 유저 관할의 모든 동아리정보 반환.
export const getMyCommunities = async () => {
    const response = await communityHttp.get(`/community/owner`);
    return response.data;
};
//#endregion

//---------------[가입 신청 COMMUNITY ENROLLMENT].
//#region
//동아리 가입 신청서 작성.
export const submitCommunityEnrollment = async (communityId, formData) => {
    try {
        const response = await communityHttp.post(
            `/community/${communityId}/enrollments`,
            formData
        );
        return response.data;
    } catch (error) {
        console.error("가입 신청 실패:", error);
        throw error;
    }
};

//동아리 가입 신청 목록 조회, 운영자 전용.
export const getEnrollmentList = async (
    communityId,
    status,
    page = 0,
    size = 10
) => {
    const res = await communityHttp.get(
        `/community/${communityId}/enrollments`,
        {
            params: { status, page, size },
        }
    );
    return res.data;
};

//동아리 가입 신청 승인, 운영자 전용.
export const approveEnrollment = async (communityId, enrollmentId) => {
    const res = await communityHttp.post(
        `/community/${communityId}/enrollments/${enrollmentId}/approve`,
        null
    );
    return res.data;
};

//동아리 가입 신청 거절, 운영자 전용.
export const denyEnrollment = async (communityId, enrollmentId, reason) => {
    const res = await communityHttp.post(
        `/community/${communityId}/enrollments/${enrollmentId}/deny`,
        null,
        {
            params: { reason },
        }
    );
    return res.data;
};
//#endregion

//---------------[게시물 COMMUNITY POST].

//내가 멤버로 속한 동아리 정보 조회.
export const fetchAllPost = async (
    communityId,
    page = 0,
    size = 10,
    search = ""
) => {
    try {
        const response = await communityHttp.get(
            `/community/${communityId}/posts`,
            {
                params: { page, size, search },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Post 목록 조회 실패:", error);
        return false;
    }
};

//#region
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
export const fetchCommunityPostDetail = async (
    postId,
    withSignedUrls = true
) => {
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

//단일 게시물의 "댓글 목록 조회".
export const fetchCommunityPostComments = async (
    postId,
    page = 0,
    size = 10
) => {
    try {
        const response = await communityHttp.get(
            `/community/comments/${postId}`,
            {
                params: { page, size },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`댓글 목록 조회 실패 (postId: ${postId}):`, error);
        throw error;
    }
};

// 단일 게시물의 "댓글 작성"
export const createCommunityPostComment = async (postId, userId, content) => {
    try {
        const response = await communityHttp.post(`/community/comments`, null, {
            params: { postId, userId, content },
        });
        return response.data;
    } catch (error) {
        console.error(`댓글 작성 실패 (postId: ${postId}):`, error);
        throw error;
    }
};

// 단일 댓글의 "내용 수정"
export const updateCommunityPostComment = async (
    commentId,
    userId,
    content
) => {
    try {
        const response = await communityHttp.put(
            `/community/comments/${commentId}`,
            null,
            {
                params: { userId, content },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`댓글 수정 실패 (commentId: ${commentId}):`, error);
        throw error;
    }
};

// 단일 댓글의 "삭제"
export const deleteCommunityPostComment = async (commentId, userId) => {
    try {
        const response = await communityHttp.delete(
            `/community/comments/${commentId}`,
            {
                params: { userId },
            }
        );
        return response.status; // 204 expected
    } catch (error) {
        console.error(`댓글 삭제 실패 (commentId: ${commentId}):`, error);
        throw error;
    }
};

// 게시물 내용 수정을 위해 가져오기
export const getEditPost = async (postId, content) => {
    try {
        const response = await communityHttp.get(
            `/community-post/${postId}/edit`,
            null,
            {
                params: { content },
            }
        );
        return response.data;
    } catch (error) {
        console.error("게시물 조회 실패", error);
        throw error;
    }
};

//가져온 데이터 수정 후 적용하기.
export const updateCommunityPost = async (communityId, postId, formData) => {
    try {
        const response = await communityHttp.put(
            `/community/${communityId}/post/${postId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("게시물 수정 실패", error);
        throw error;
    }
};

//동호회 게시물 삭제.
export const deleteCommunityPost = async (communityId, postId) => {
    try {
        const res = await communityHttp.delete(
            `/community/${communityId}/post/${postId}`
        );
        return res.data;
    } catch (err) {
        console.error("게시물 삭제 실패:", err);
        throw err;
    }
};
//#endregion

//---------------[회원 COMMUNITY MEMBER].
//#region

export const checkIfMember = async () => {
    try {
        const response = await communityHttp.get("/community-member/is-member");
        return response.data;
    } catch (error) {
        console.error("isMember 확인 실패:", error);
        return false;
    }
};

//내가 멤버로 속한 동아리 정보 조회.
export const fetchMyCommunityList = async (
    page = 0,
    size = 10,
    activeOnly = true,
    search = ""
) => {
    try {
        const response = await communityHttp.get(
            "/community-member/my-community",
            {
                params: { page, size, activeOnly, search },
            }
        );
        return response.data;
    } catch (error) {
        console.error("MyCommunityList 조회 실패:", error);
        return false;
    }
};

//동아리 회원 가입 탈퇴(구성원에 의한 자발적).
export const quitMemberSelf = async (communityId, reason) => {
    return communityHttp.put(`/community-member/${communityId}/quit`, null, {
        params: { reason },
    });
};

//동아리 회원 목록 조회.
export const getMemberList = async (
    communityId,
    status,
    page = 0,
    size = 10
) => {
    const res = await communityHttp.get(`/community/${communityId}/members`, {
        params: { status, page, size },
    });
    return res.data;
};

//동아리 회원 정지 처분, 운영자 전용.
export const suspendMember = async (communityId, memberId, reason) => {
    return communityHttp.put(
        `/community/${communityId}/members/${memberId}/suspend`,
        null,
        {
            params: { reason },
        }
    );
};

//동아리 회원 재활성 처리.
export const activateMember = async (communityId, memberId) => {
    console.log("activateMember 호출됨");
    return communityHttp.put(
        `/community/${communityId}/members/${memberId}/activate`,
        null
    );
};

//동아리 회원 가입 탈퇴(운영자에 의한 강제).
export const quitMemberOwner = async (communityId, memberId, reason) => {
    return communityHttp.put(
        `/community/${communityId}/members/${memberId}/quit`,
        null,
        {
            params: { reason },
        }
    );
};

//동아리 회원 등급 조정.
export const updateRole = async (communityId, memberId, role) => {
    return (
        await communityHttp.put(
            `/community/${communityId}/members/${memberId}/role`,
            null,
            {
                params: { role },
            }
        )
    ).data;
};

//#endregion
