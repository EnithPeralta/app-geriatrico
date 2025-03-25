import geriatricoApi from '../api/geriatricoApi';
import { getToken } from '../helpers/getToken';

export const useDiagnostico = () => {
    const registrarDiagnostico = async ({ pac_id, diag_fecha, diag_descripcion }) => {
        console.log("✅ Registrando diagnóstico...", pac_id, diag_fecha);
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }
        try {
            const { data } = await geriatricoApi.post(
                `/diagnosticos/paciente/${pac_id}`,
                { diag_fecha, diag_descripcion },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Diagnóstico registrado con éxito.",
                data: data.datos || {}
            };

        } catch (error) {
            console.error("❌ Error al registrar diagnóstico:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };

    const obtenerDiagnostico = async (pac_id) => {
        console.log("✅ Obteniendo diagnóstico...", pac_id);
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }
        try {
            const { data } = await geriatricoApi.get(
                `/diagnosticos/paciente/${pac_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Diagnóstico obtenido con éxito.",
                data: data.datos || {}
            };
    
        } catch (error) {
            console.error("❌ Error al obtener diagnóstico:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };
    
    return {
        registrarDiagnostico,
        obtenerDiagnostico
    };
};
