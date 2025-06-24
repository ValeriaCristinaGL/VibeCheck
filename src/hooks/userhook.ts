import { http } from "../api/http"; 
import { useState, useEffect } from "react";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await http.get("/user/details", {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao verificar login:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    return { user, loading };
}