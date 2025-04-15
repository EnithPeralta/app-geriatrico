import geriatricoApi from '../api/geriatricoApi';
import { getToken } from '../helpers/getToken';

export const useSedesRol = () => {
    const asignarRolAdminSede = async ({ per_id, se_id, rol_id, sp_fecha_inicio, sp_fecha_fin }) => {
        console.log("Datos enviados para asignar rol a la sede:", { per_id, se_id, rol_id, sp_fecha_inicio, sp_fecha_fin });

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }

        try {
            const { data } = await geriatricoApi.post('/sedepersonarol/asignarRolesAdminSede', {
                per_id,
                se_id,
                rol_id,
                sp_fecha_inicio,
                sp_fecha_fin
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            console.log("✅ Respuesta del servidor:", data);
            return {
                success: true,
                message: data.message || "Rol administrador sede asociado exitosamente",
                sedePersonaRol: data.nuevaVinculacion,
                rolNombre: data.rolNombre,
                sede: data.sede

            };
        } catch (error) {
            console.error("❌ Error al asignar rol a la sede:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al asignar rol a la sede",
                sedePersonaRol: null
            };
        }
    };

    const inactivarRolAdminSede = async ({ per_id, se_id, rol_id }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }

        try {
            const { data } = await geriatricoApi.put(
                "/sedepersonarol/inactivarRolAdminSede",
                { per_id, se_id, rol_id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Rol administrador sede inactivado exitosamente",
                sedePersonaRol: data.data || null, // Asegurar compatibilidad con la respuesta del backend
            };

        } catch (error) {
            console.error("❌ Error al inactivar el rol de la sede:", error);

            let errorMessage = "Error al inactivar el rol de la sede";
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = "No se recibió respuesta del servidor";
            } else {
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage,
                sedePersonaRol: null,
            };
        }
    };

    const asignarRolesSede = async ({ per_id, rol_id, sp_fecha_inicio, sp_fecha_fin }) => {

        // Obtener el token
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado.",
            };
        }

        const rol_id_final = Array.isArray(rol_id) ? rol_id[0] : rol_id;

        try {
            const { data } = await geriatricoApi.post("/sedepersonarol/asignarRolSede",
                { per_id, rol_id: rol_id_final, sp_fecha_inicio, sp_fecha_fin: sp_fecha_fin || null },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Rol asignado correctamente.",
                nuevaVinculacion: data.nuevaVinculacion,
                rolNombre: data.rolNombre,
                mensajeAdicional: data.mensajeAdicional || "",
                sede: data.sede || null,
            };
        } catch (error) {
            console.error("❌ Error al asignar roles a la sede:", error);
            let errorMessage = error.response.data?.message || errorMessage;

            return {
                success: false,
                message: errorMessage,
                sedePersonaRol: null,
            };
        }
    };

    const inactivarRolesSede = async ({ per_id, se_id, rol_id }) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }

        try {
            const { data } = await geriatricoApi.put(
                "/sedepersonarol/inactivarRolSede",
                { per_id, se_id, rol_id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Rol inactivado exitosamente",
                sedePersonaRol: data.data || null,
            };
        } catch (error) {
            console.error("❌ Error al inactivar el rol de la sede:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al inactivar el rol de la sede",
            };
        }
    };


    return { asignarRolAdminSede, inactivarRolAdminSede, asignarRolesSede, inactivarRolesSede };
};