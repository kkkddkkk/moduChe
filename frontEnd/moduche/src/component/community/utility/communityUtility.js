//날짜 문자열 가공 함수.
export const formattedDate = (createdAt) => {
    const date = new Date(createdAt);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}년 ${mm}월 ${dd}일`;
};


//문자열 자르기 함수.
export const sliceContent = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
};

//AWS signed URL 부분 도려내기 (.com 뒷부분).
export const extractKeyFromUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (!url.includes(".com/")) return null; // blob:// 차단

    return url.split(".com/")[1].split("?")[0];
};

//위경도 반환용 유틸 함수.
export const getCoords = async (address) => {
    try {
        const res = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
                address
            )}`,
            {
                headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
                },
            }
        );

        if (!res.ok) throw new Error("Kakao 주소 좌표 변환 실패");
        const data = await res.json();

        if (!data.documents?.length) {
            console.warn("좌표 정보 없음:", address);
            return null;
        }

        const { x, y } = data.documents[0];
        return { lat: y, lng: x };
    } catch (err) {
        console.error("getCoords() 오류:", err);
        return null;
    }
};
