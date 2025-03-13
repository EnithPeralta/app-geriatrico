import { useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";


export const useEnfermera = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);

    const startRegisterEnfermera = async (datos) => {
        console.log("📌 Datos a enviar:", datos);
    
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado.",
            };
        }
    
        try {
            const { data } = await geriatricoApi.post("enfermeras/registrar", datos, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", data);
            return {
                success: true,
                message: data.message || "Enfermera registrada con éxito.",
                nuevaEnfermera: data.nuevaEnfermera || null,
            };
        } catch (error) {
            console.error("❌ Error al registrar enfermera:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
            };
        }
    };

    const obtenerRolesEnfermerasSede = async () => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "❌ Token de autenticación no encontrado",
                data: []
            };
        }
    
        try {
            const { data } = await geriatricoApi.get("enfermeras/sede", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Roles obtenidos exitosamente",
                data: data.enfermeras || [] // Asegura que siempre se devuelva un array
            };
    
        } catch (error) {
            console.error("❌ Error al obtener los roles de enfermeras:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
                data: []
            };
        }
    };
    

    return {
        // Propiedades
        status, user, errorMessage,
        // Metodos
        startRegisterEnfermera,
        obtenerRolesEnfermerasSede
    }
}
