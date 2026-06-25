// components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/userhook";

interface ProtectedRouteProps {
  children: React.ReactNode;  // Conteúdo protegido que será renderizado caso o usuário tenha acesso
  requiredRole?: string;      // Papel necessário para acessar a rota (opcional)
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();  // Hook personalizado que retorna o usuário autenticado e estado de loading
  const navigate = useNavigate();       // Hook para navegação programática

  useEffect(() => {
    if (!loading) {  // Só faz a verificação quando o loading terminar
      if (!user) {
        // Se não tiver usuário autenticado, redireciona para a página inicial (login)
        navigate("/");
      } else if (
        requiredRole &&
        user.role !== requiredRole  // Se houver um papel exigido e o usuário não o tiver, redireciona também
      ) {
        navigate("/");
      }
    }
  }, [user, loading, navigate, requiredRole]);

  // Enquanto carrega a autenticação ou não há usuário, mostra mensagem de loading
  if (loading || !user) {
    return <p className="text-white">Verificando autenticação...</p>;
  }

  // Caso passe nas validações, renderiza o conteúdo protegido
  return <>{children}</>;
}
