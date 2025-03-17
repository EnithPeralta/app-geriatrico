import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useGeriatricoPersona = () => {
   
    const obtenerPersonaRolesMiGeriatricoSede = async (per_id) => {
        if (!per_id) {
            return {
                success: false,
                message: "ID de persona no proporcionado.",
            };
        }
    
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const response = await geriatricoApi.get(`/geriatricopersona/rolesGeriatrico/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            return {
                success: true,
                message: response.data?.message || "Persona y roles obtenidos con éxito.",
                persona: response.data?.persona ?? {},  // Devuelve un objeto vacío si no hay datos
            };
        } catch (error) {
            console.error("Error al obtener persona y roles:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener la información.",
                errorCode: error.response?.status || null, // Agrega código de error HTTP si está disponible
            };
        }
    };
    

    const personasVinculadasMiGeriatrico = async () => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const response = await geriatricoApi.get("/geriatricopersona/vinculadas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                success: true,
                message: response.data.message || "Personas vinculadas obtenidas con éxito.",
                personas: response.data || [],
            };

        } catch (error) {
            console.error("Error al obtener personas vinculadas:", error.response?.data || error.message);

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener las personas vinculadas.",
            };
        }
    }
    const inactivarVinculacionGeriatrico = async (per_id) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const response = await geriatricoApi.put(`/geriatricopersona/desvincular/${per_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Respuesta de la API:", response.data);
            return {
                success: true,
                status: response.status,
                message: response.data.message || "Vinculación inactivada con éxito.",
            };

        } catch (error) {
            console.error("Error al inactivar la vinculación:", error);

            return {
                success: false,
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Error al inactivar la vinculación.",
                errorDetails: error.response?.data || error.message,
            };
        }
    };

    const reactivarVinculacionGeriatrico = async (per_id) => {
        if (!per_id) {
            console.error("Error: per_id es requerido para reactivar la vinculación.");
            return { success: false, message: "El ID de la persona es obligatorio." };
        }

        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.put(
                `/geriatricopersona/reactivarVinculacion/${per_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                status: response.status,
                message: response.data.message || "Vinculación reactivada con éxito.",
                persona: response.data.persona || null, // Retorna la persona si el backend lo envía
            };
        } catch (error) {
            console.error("❌ Error al reactivar la vinculación:", error.response || error);

            return {
                success: false,
                status: error.response?.status || 500,
                message: error.response?.data?.message || "Error al reactivar la vinculación.",
                errorDetails: error.response?.data || error.message,
            };
        }
    };

    return {
        // vincularPersonaAGeriatrico,
        obtenerPersonaRolesMiGeriatricoSede,
        personasVinculadasMiGeriatrico,
        inactivarVinculacionGeriatrico,
        reactivarVinculacionGeriatrico
    }
}
