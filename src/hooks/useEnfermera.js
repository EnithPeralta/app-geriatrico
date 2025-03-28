import { useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";


export const useEnfermera = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);

    const startRegisterEnfermera = async ({ per_id, enf_codigo }) => {
        console.log("📌 Datos a enviar:", per_id, enf_codigo);

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.post("enfermeras/registrar", { per_id, enf_codigo }, {
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

    const obtenerEnfermerasSede = async () => {
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
                data: data.data || [] // Asegura que siempre se devuelva un array
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

    const obtenerRolesEnfermerasSede = async (per_id) => {
        if (!per_id) {
            return {
                success: false,
                message: "❌ El ID de la persona es requerido",
                data: [],
            };
        }
    
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "❌ Token de autenticación no encontrado",
                data: [],
            };
        }
    
        try {
            const { data } = await geriatricoApi.get(`enfermeras/roles/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Enfermeras obtenidas exitosamente",
                data: data.enfermeras || [], // ✅ Se asegura de devolver un array válido
            };
    
        } catch (error) {
            console.error("❌ Error al obtener los roles de enfermeras:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
                data: [],
            };
        }
    };
    
    return {
        // Propiedades
        status, user, errorMessage,
        // Metodos
        startRegisterEnfermera,
        obtenerEnfermerasSede,
        obtenerRolesEnfermerasSede
    }
}
