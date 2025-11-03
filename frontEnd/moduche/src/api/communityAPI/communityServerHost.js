const API_SERVER_HOST =
  process.env.NODE_ENV === "production"
    ? "https:추후 배포 웹 주소로..."
    : "http://localhost:8080";

export default API_SERVER_HOST;