import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Role = "student" | "teacher" | "admin" | null;

export const useRoleRedirect = (role: Role) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return;
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/");
    }
  }, [role, navigate]);
};

