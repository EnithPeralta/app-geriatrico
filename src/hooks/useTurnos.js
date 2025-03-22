import { data } from "react-router-dom";
import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";

export const useTurnos = () => {
    const asignarTurnoEnfermeria = async ({ enf_id, tur_fecha_inicio, tur_fecha_fin, tur_hora_inicio, tur_hora_fin, tur_tipo_turno }) => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.post(`/turnos/asignar/${enf_id}`,
                { tur_fecha_inicio, tur_fecha_fin, tur_hora_inicio, tur_hora_fin, tur_tipo_turno },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", response.data);
            return {
                success: true,
                message: response.data.message || "Turno asignado exitosamente.",
                data: response.data
            };
        } catch (error) {
            console.error("❌ Error al asignar turno:", error);
            console.error(error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };

    const verMisTurnosEnfermeria = async () => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.get(`/turnos/misturnos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "Turnos obtenidos exitosamente.",
                turnos: response.data.turnos_por_sede || [], // Extraer los turnos agrupados
            };

        } catch (error) {
            console.error("❌ Error al obtener turnos:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    };

    const verTurnosSede = async () => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.get(`/turnos/sede`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "Turnos obtenidos exitosamente.",
                turnos: response.data.turnos || [], // Extraer los turnos agrupados
            };

        } catch (error) {
            console.error("❌ Error al obtener turnos:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message
            };
        }
    }


    return { asignarTurnoEnfermeria, verMisTurnosEnfermeria, verTurnosSede };
};
