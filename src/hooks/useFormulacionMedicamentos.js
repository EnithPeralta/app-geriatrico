import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers";

export const useFormulacionMedicamentos = () => {
    const registrarFormulacionMedicamento = async ({ pac_id, med_id, admin_fecha_inicio, admin_fecha_fin, admin_dosis_por_toma, admin_tipo_cantidad, admin_hora, admin_metodo }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.post(
                `/formulacionmedicamentos/${pac_id}`,
                {
                    med_id,
                    admin_fecha_inicio,
                    admin_fecha_fin,
                    admin_dosis_por_toma,
                    admin_tipo_cantidad,
                    admin_hora,
                    admin_metodo
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                message: data.message || "Formulación registrada con éxito.",
                data: data.formulacion || {},
            };
        } catch (error) {
            console.error("❌ Error al registrar formulación:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
            };
        }
    };

    const formulacionMedicamentoVigente = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.get(`/formulacionmedicamentos/${pac_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                success: true,
                message: data.message || "Formulación obtenida con éxito.",
                data,
                pendientes: data.pendientes || [],
                en_curso: data.en_curso || [],
            };
        } catch (error) {
            console.error("❌ Error al obtener formulación:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrido un error inesperado. Inténtalo nuevamente.",
            };
        }
    }

    const formulacionMedicamentoHistorial = async (pac_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.get(`/formulacionmedicamentos/historial/${pac_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                success: true,
                message: data.message || "Formulación obtenida con éxito.",
                data,
                completadas: data.completadas || [],
                suspendidas: data.suspendidas || [],
            };
        } catch (error) {
            console.error("❌ Error al obtener formulación:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
            };
        }
    };

    const actualizarFormulacionPendiente = async ({
        admin_id,
        med_id,
        admin_fecha_inicio,
        admin_fecha_fin,
        admin_dosis_por_toma,
        admin_tipo_cantidad,
        admin_hora,
        admin_metodo,
    }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const payload = {
                med_id,
                admin_fecha_inicio,
                admin_fecha_fin,
                admin_dosis_por_toma,
                admin_tipo_cantidad,
                admin_hora,
                admin_metodo,
            };


            const { data } = await geriatricoApi.put(
                `/formulacionmedicamentos/${admin_id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                message: data.message || "Formulación actualizada con éxito.",
                data: data.formulacion || {},
            };
        } catch (error) {
            console.error("❌ Error al actualizar formulación:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrió un error inesperado. Inténtalo nuevamente.",
            };
        }
    };

    const deleteFormulacionPendiente = async (admin_id) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.delete(`/formulacionmedicamentos/${admin_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                success: true,
                message: data.message || "Formulación eliminada correctamente.",
                admin_id: admin_id,
            };
        } catch (error) {
            console.error("❌ Error al eliminar formulación:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrió un error inesperado al intentar eliminar la formulación.",
            };
        }
    };

    const suspenderFormulacionEnCurso = async (admin_id, admin_motivo_suspension) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.put(
                `/formulacionmedicamentos/suspender/${admin_id}`,
                { admin_motivo_suspension }, // ✅ Enviar motivo en el body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                message: data.message || "Formulación suspendida correctamente.",
                data: data.formulacion, // ✅ opcional: devolver la formulación actualizada
            };
        } catch (error) {
            console.error("❌ Error al suspender formulación:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrió un error inesperado al intentar suspender la formulación.",
            };
        }
    };

    const extenderFechaFinFormulacion = async (admin_id, admin_fecha_fin) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.put(
                `/formulacionmedicamentos/extender/${admin_id}`,
                { admin_fecha_fin },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                success: true,
                message: data.message || "Formulación extendida correctamente.",
                data: data.formulacion,
            };
        } catch (error) {
            console.error("❌ Error al suspender formulación:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrido un error inesperado al intentar suspender la formulación.",
            };
        }
    };

    const obtenerFormulacionesDelDia = async (pac_id) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.get(`/formulacionmedicamentos/diaria/${pac_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log(data);

            return {
                success: true,
                message: data.message || "Formulación obtenida con éxito.",
                data,
            }
        } catch (error) {
            console.error("❌ Error al obtener formulación:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Ocurrido un error inesperado al intentar obtener la formulación.",
            };
        }
    }



    return {
        registrarFormulacionMedicamento,
        formulacionMedicamentoVigente,
        formulacionMedicamentoHistorial,
        actualizarFormulacionPendiente,
        deleteFormulacionPendiente,
        suspenderFormulacionEnCurso,
        extenderFechaFinFormulacion,
        obtenerFormulacionesDelDia
    }
}
