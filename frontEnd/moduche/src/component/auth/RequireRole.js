import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/auth";

export default function RequireRole({ role: requiredRole, children }) {
    const userRole = getRoleFromToken(localStorage.getItem("accessToken"));

    if (!userRole) {
        return <Navigate to="/admin" replace />;
    }

    if (userRole !== requiredRole) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h2 style={{ color: "red" }}>접근 권한 없음</h2>
                <p>이 페이지는 {requiredRole} 권한만 접근할 수 있습니다.</p>
            </div>
        );
    }

    return children;
}
