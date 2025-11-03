import communityHttp from "./communityHttp"; 

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