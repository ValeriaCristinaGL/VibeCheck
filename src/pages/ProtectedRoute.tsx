// components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/userhook";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
      } else if (
        requiredRole &&
        user.role !== requiredRole
      ) {
        navigate("/");
      }
    }
  }, [user, loading, navigate, requiredRole]);

  if (loading || !user) {
    return <p className="text-white">Verificando autenticação...</p>;
  }

  return <>{children}</>;
}
