import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";
import { formatTo12Hour } from "../utils/Hora";

export const useTurnos = () => {
    const asignarTurnoEnfermeria = async ({ enf_id, tur_fecha_inicio, tur_fecha_fin, tur_hora_inicio, tur_hora_fin, tur_tipo_turno }) => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }
        const formattedHoraInicio = formatTo12Hour(tur_hora_inicio);
        const formattedHoraFin = formatTo12Hour(tur_hora_fin);


        try {
            const response = await geriatricoApi.post(`/turnos/asignar/${enf_id}`,
                {
                    tur_fecha_inicio,
                    tur_fecha_fin,
                    tur_hora_inicio: formattedHoraInicio,
                    tur_hora_fin: formattedHoraFin,
                    tur_tipo_turno
                },
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
                message: error.response?.data?.error || "Ocurrió un error inesperado.",
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
                turnos: response.data || [], // Extraer los turnos agrupados
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

            console.log("✅ Respuesta del servidor Turnos: ", response.data);

            return {
                success: true,
                message: response.data.message || "Turnos obtenidos exitosamente.",
                turnos: response.data.turnos || [], // Extraer los turnos agrupados
            };

        } catch (error) {
            console.error("❌ Error al obtener turnos:", error);

            return {
                success: false,
                message: error.response?.data?.error.message,
                error: error.response?.data?.error.message || error.message.data?.error.message
            };
        }
    }

    const verTurnosSedeHistorialEnfermera = async (enf_id) => {
        const token = getToken();

        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.get(`/turnos/historialsede/${enf_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor Turnos:", response.data);

            return {
                success: true,
                message: response.data?.message || "Turnos obtenidos exitosamente.",
                turnos: response.data?.turnos ?? [], // Usa `??` para evitar problemas con `undefined`
            };

        } catch (error) {
            console.error("❌ Error al obtener turnos:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los turnos.",
                error: error.response?.data?.error?.message || error.message || "Error desconocido.",
            };
        }
    };

    const verMisTurnosEnfermeriaHistorial = async () => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.get(`/turnos/mihistorial`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "Turnos obtenidos exitosamente.",
                turnos_por_sede: response.data.turnos_por_sede || [],
            };

        } catch (error) {
            console.error("❌ Error al obtener turnos:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || { message: error.message }
            };
        }
    };

    const eliminarTurnoEnfermeria = async (tur_id) => {
        if (!tur_id) {
            return { success: false, message: "⛔ ID del turno no proporcionado." };
        }

        const token = getToken();
        if (!token) {
            return { success: false, message: "⛔ Token de autenticación no encontrado." };
        }

        try {
            const response = await geriatricoApi.delete(`/turnos/eliminar/${tur_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "✅ Turno eliminado exitosamente.",
                data: response.data
            };

        } catch (error) {
            console.error("❌ Error al eliminar turno:", error);
            // Obtener código de estado y mensaje de error
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || "⛔ Ocurrió un error inesperado.";

            return {
                success: false,
                message: errorMessage,
                statusCode,
                error: error.response?.data || error.message
            };
        }
    };

    const actualizarTurnoEnfermeria = async ({ tur_id, tur_fecha_inicio, tur_fecha_fin, tur_hora_inicio, tur_hora_fin, tur_tipo_turno }) => {
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        // Convertimos la hora a formato 12H antes de enviarla
        const formattedHoraInicio = formatTo12Hour(tur_hora_inicio);
        const formattedHoraFin = formatTo12Hour(tur_hora_fin);

        try {
            const response = await geriatricoApi.put(`/turnos/actualizar/${tur_id}`, {
                tur_fecha_inicio,
                tur_fecha_fin,
                tur_hora_inicio: formattedHoraInicio, // Formato 12H
                tur_hora_fin: formattedHoraFin, // Formato 12H
                tur_tipo_turno
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Respuesta del servidor:", response.data);

            return {
                success: true,
                message: response.data.message || "Turno actualizado exitosamente.",
                data: response.data
            };

        } catch (error) {
            console.error("❌ Error al actualizar turno:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
                error: error.response?.data || error.message,
                conflito: [
                    ...(error.response?.data?.conflictos?.enEstaSede?.map(conflicto =>
                        `📍 Sede: ${conflicto.sede}\n📅 Inicio: ${conflicto.fecha_inicio} ${conflicto.hora_inicio}\n📅 Fin: ${conflicto.fecha_fin} ${conflicto.hora_fin}`
                    ) || ["✅ Sin conflictos en esta sede."]),

                    ...(error.response?.data?.conflictos?.enOtraSede?.map(conflicto =>
                        `📍 Sede (Otra): ${conflicto.sede}\n📅 Inicio: ${conflicto.fecha_inicio} ${conflicto.hora_inicio}\n📅 Fin: ${conflicto.fecha_fin} ${conflicto.hora_fin}`
                    ) || ["✅ Sin conflictos en otra sede."])
                ].join("\n\n"),
            };

        }
    };


    return {
        asignarTurnoEnfermeria,
        verMisTurnosEnfermeria,
        verTurnosSede,
        eliminarTurnoEnfermeria,
        verTurnosSedeHistorialEnfermera,
        verMisTurnosEnfermeriaHistorial,
        actualizarTurnoEnfermeria
    };
};
