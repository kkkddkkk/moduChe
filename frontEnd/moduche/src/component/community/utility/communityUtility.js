//날짜 문자열 가공 함수.
export const formattedDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

//문자열 자르기 함수.
export const sliceContent = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
};

//AWS signed URL 부분 도려내기 (.com 뒷부분).
export const extractKeyFromUrl = (url) => {
    return url.split(".com/")[1].split("?")[0];
};