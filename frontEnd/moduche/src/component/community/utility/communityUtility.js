//날짜 문자열 가공 함수.
export const formattedDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};
