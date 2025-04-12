import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useColaboradores = () => {
    const obtenerColaboradoresSede = async () => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            }
        }
        try {
            const { data } = await geriatricoApi.get(
                `/colaboradores/sede`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Colaboradores obtenidos exitosamente",
                data
            }
        } catch (error) {
            console.error("❌ Error al obtener colaboradores:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrio un error inesperado",
            }
        }
    };
    const obtenerRolesColaboradoresSede = async (per_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            }
        }
        try {
            const { data } = await geriatricoApi.get(
                `/colaboradores/roles/${per_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Roles obtenidos exitosamente",
                data: data.Colaboradores
            }
        } catch (error) {
            console.error("❌ Error al obtener roles de colaboradores:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrio un error inesperado",
            }
        }
    };

    return {
        obtenerColaboradoresSede,
        obtenerRolesColaboradoresSede
    }
}
