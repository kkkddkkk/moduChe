export const numberFormat = (number) => {
  if (number == null) return "0"
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const dateFormat = (localDateTime) => {
  if (!localDateTime) return "";
  const date = new Date(localDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const dateToDay = (localDateTime) => {
  if (!localDateTime) return "";

  const date = new Date(localDateTime);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[date.getDay()];
  return `${dayName}`;
}

export const handleApiError = (error) => {
  let message = "알 수 없는 오류가 발생했습니다.";

  if (!error.response) {
    // 네트워크 오류 (서버 연결 실패 등)
    message = "서버와 연결할 수 없습니다. 네트워크를 확인하세요.";
  } else {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        message = data.message || "400: 잘못된 요청입니다.";
        break;
      case 401:
        message = "401: 로그인이 필요합니다.";
        break;
      case 403:
        message = "403: 접근 권한이 없습니다.";
        break;
      case 404:
        message = "404: 요청한 리소스를 찾을 수 없습니다.";
        break;
      case 500:
        message = "500: 서버 오류가 발생했습니다.";
        break;
      default:
        message = data.message || `오류가 발생했습니다 (코드: ${status})`;
        break;
    }
  }

  console.error(error); // 디버깅용
  return alert(message);
};
