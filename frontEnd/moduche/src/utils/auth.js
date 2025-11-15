import { jwtDecode } from "jwt-decode";

//토큰 가져오기
export const decodeToken = (token) => {
  if(token===null) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

//loginId 가져오기
export const getUsernameFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return decoded.sub || null;
};

//role 가져오기
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return decoded.role || null;
};

//loginId, role 가져오기
export const getIdRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  const dto={
    username: decoded.sub,
    role: decoded.role
  }
  return dto || null;
};

//토큰 만료되었는지 확인
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  return decoded.exp * 1000 < Date.now(); // exp는 초 단위라 *1000
};

//로그인 상태인지 확인
export const isLoggedIn = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;
  return !isTokenExpired(token);
};