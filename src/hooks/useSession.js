import { useState } from "react";
import geriatricoApi from "../api/geriatricoApi";

export const useSession = () => {
    const [session, setSession] = useState(() => {
        const storedSession = localStorage.getItem("session");
        return storedSession ? JSON.parse(storedSession) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const obtenerSesion = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await geriatricoApi.get("/obtenerSesion");
            setSession(data);
            localStorage.setItem("session", JSON.stringify(data)); // 🔹 Guarda sesión actualizada en localStorage
            console.log("✅ Sesión obtenida:", data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error("❌ Error obteniendo sesión:", err.response || err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        session,
        loading,
        error,
        obtenerSesion,
    };
};
