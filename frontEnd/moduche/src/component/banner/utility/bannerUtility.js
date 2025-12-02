export const getBannerSize = (banner) => {
    if (banner === 2) {
        return "1200 * 120";
    } else if (banner === 3) {
        return "210 * 350";
    } else if (banner === 1) {
        return "1600 * 800";
    } else {
        return "UNDEFINED";
    }
};

export const getBannerType = (banner) => {
    if (banner === "MAIN") {
        return "메인 배너";
    } else if (banner === "SIDE") {
        return "사이드 배너";
    } else if (banner === "HEADER") {
        return "상단 배너";
    } else {
        return "UNDEFINED";
    }
};

export function validateEmail(email) {
    if (!email) return false;

    const emailRegex =
        /^[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([.-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

export function formatPrice(num) {
    if (num === null || num === undefined) return "";
    return Number(num).toLocaleString("ko-KR");
}

export const formatBannerPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜 포맷 함수.
    const format = (d) => {
        const yyyy = d.getFullYear();
        const mm = d.getMonth() + 1;
        const dd = d.getDate();
        return `${yyyy}년 ${mm}월 ${dd}일`;
    };

    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((end - start) / oneDay) + 1;

    return `${format(start)} ~ ${format(end)} (총 ${diffDays}일)`;
};

export const formatDaysOnly = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((end - start) / oneDay) + 1;

    return `총 ${diffDays}일`;
};
