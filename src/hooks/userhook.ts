import { http } from "../api/http";
import { useState, useEffect } from "react";

type User = {
  role: string;
  googleId: string;
  email: string;
  name: string;
};

export function useAuth() {
  // Estado para armazenar os dados do usuário autenticado (ou null se não autenticado)
  const [user, setUser] = useState<User | null>(null);

  // Estado para controlar o carregamento (true enquanto verifica o login)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função assíncrona para checar o status de autenticação do usuário
    const checkAuthStatus = async () => {
      try {
        // Faz a requisição para obter os detalhes do usuário, enviando cookies
        const response = await http.get("/user/details", {
          withCredentials: true,
        });

        const data = response.data;

        // Verifica se o usuário tem roles e se o array não está vazio
        if (data && Array.isArray(data.roles) && data.roles.length > 0) {
          // Define os dados do usuário no estado
          setUser({
            role: data.roles[0], // Pega o primeiro papel (role)
            googleId: data.googleId,
            email: data.email,
            name: data.name,
          });
        } else {
          // Caso não tenha roles, considera usuário não autenticado
          setUser(null);
        }
      } catch (error) {
        // Em caso de erro na requisição, loga no console e define usuário como null
        console.error("Erro ao verificar login:", error);
        setUser(null);
      } finally {
        // Finaliza o loading independente do resultado
        setLoading(false);
      }
    };

    // Chama a função de verificação de autenticação ao montar o hook
    checkAuthStatus();
  }, []);

  // Retorna o usuário e o estado de loading para o componente consumir
  return { user, loading };
}
