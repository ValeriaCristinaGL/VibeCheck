import { http } from "../api/http";
import { useState, useEffect } from "react";

type User = {
    role: string;
    googleId: string;
    email: string;
    name: string;
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await http.get("/user/details", {
                    withCredentials: true,
                });
                const data = response.data;
                if (data && Array.isArray(data.roles) && data.roles.length > 0) {
                    setUser({
                        role: data.roles[0],
                        googleId: data.googleId,
                        email: data.email,
                        name: data.name,
                    });
                } else {
                    setUser(null);
                }
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