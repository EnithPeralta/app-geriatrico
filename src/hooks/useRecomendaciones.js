import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useRecomendaciones = () => {
    const registrarRecomendacion = async ({ pac_id, rec_fecha, rec_cubrir_piel_m, rec_cubrir_piel_t, rec_cubrir_piel_n, rec_asistir_alimentacion_m, rec_asistir_alimentacion_t, rec_asistir_alimentacion_n, rec_prevenir_caidas, rec_actividad_ocupacional, rec_actividad_fisica, rec_otras }) => {
        console.log("✅ Registrando recomendación...", pac_id, rec_fecha);
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const { data } = await geriatricoApi.post(
                `/recomendaciones/paciente/${pac_id}`,
                {
                    rec_fecha,
                    rec_cubrir_piel_m,
                    rec_cubrir_piel_t,
                    rec_cubrir_piel_n,
                    rec_asistir_alimentacion_m,
                    rec_asistir_alimentacion_t,
                    rec_asistir_alimentacion_n,
                    rec_prevenir_caidas,
                    rec_actividad_ocupacional,
                    rec_actividad_fisica,
                    rec_otras
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return {
                success: true,
                message: data.message || "Operación realizada con éxito.",
                data: data.datos || data.recomendacion
            };
        } catch (error) {
            console.error("❌ Error al registrar/actualizar recomendación:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };

    const obtenerRecomendaciones = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        const pacienteId = Number(pac_id);

        try {
            const { data } = await geriatricoApi.get(`/recomendaciones/paciente/${pacienteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data || !data.datos) {
                console.warn("⚠️ No se encontraron datos en la respuesta del servidor.");
                return {
                    success: false,
                    message: data?.message || "No hay datos disponibles.",
                    data: []
                };
            }

            return {
                success: true,
                message: data.message || "Operación realizada con éxito.",
                data: data.datos
            };
        } catch (error) {
            console.error("❌ Error al obtener recomendaciones:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
                data: []
            };
        }
    };
    
    const actualizarRecomendacion = async ({ pac_id, rec_fecha, rec_cubrir_piel_m, rec_cubrir_piel_t, rec_cubrir_piel_n, rec_asistir_alimentacion_m, rec_asistir_alimentacion_t, rec_asistir_alimentacion_n, rec_prevenir_caidas, rec_actividad_ocupacional, rec_actividad_fisica, rec_otras }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
        try {
            const { data } = await geriatricoApi.put(`/recomendaciones/paciente/${pac_id}`, {
                rec_fecha,
                rec_cubrir_piel_m,
                rec_cubrir_piel_t,
                rec_cubrir_piel_n,
                rec_asistir_alimentacion_m,
                rec_asistir_alimentacion_t,
                rec_asistir_alimentacion_n,
                rec_prevenir_caidas,
                rec_actividad_ocupacional,
                rec_actividad_fisica,
                rec_otras
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return {
                success: true,
                message: data.message || "Operación realizada con éxito.",
                data: data.datos || data.recomendacion
            };
        } catch (error) {
            console.error("�� Error al actualizar recomendación:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    }
    return {
        registrarRecomendacion,
        obtenerRecomendaciones,
        actualizarRecomendacion
    };
};
