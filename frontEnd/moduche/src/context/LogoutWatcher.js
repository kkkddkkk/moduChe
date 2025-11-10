import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useEffect } from "react";

export const LogoutWatcher = () => {
  const { loggedIn } = useUser();
  const navigate = useNavigate(); // 안전하게 Router context 안에서 호출

  useEffect(() => {
    if (!loggedIn) {
      alert('로그아웃 되었습니다.');
      navigate('/', { replace: true });
    }
  }, [loggedIn, navigate]);

  return null;
};