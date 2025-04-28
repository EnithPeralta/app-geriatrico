import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useAcudiente = () => {
    const registrarAcudiente = async ({ pac_id, per_id, pa_parentesco }) => {
        console.log("📤 Datos enviados para registrar acudiente:", { pac_id, per_id, pa_parentesco });

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.post(
                '/acudientes/registrar',
                { pac_id, per_id: Number(per_id), pa_parentesco }, // Convertir per_id a número
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", data);

            // Manejo de respuestas según el controlador
            if (data?.existe) {
                return {
                    success: true,
                    message: "La persona ya está registrada como acudiente de este paciente.",
                    acudiente: data.acudiente,
                };
            }

            if (data?.reactivado) {
                return {
                    success: true,
                    message: "El acudiente estaba inactivo y ha sido reactivado.",
                    acudiente: data.acudiente,
                };
            }

            return {
                success: true,
                message: "Acudiente registrado correctamente.",
                acudiente: data.acudiente,
            };
        } catch (error) {
            console.error("❌ Error al registrar acudiente:", error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Error desconocido",
            };
            
        }
    };

    const obtenerAcudientesDePaciente = async (pac_id) => { 
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado."
            };
        }
        try {
            const { data } = await geriatricoApi.get(`/acudientes/paciente/${pac_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("✅ Respuesta del servidor:", data);
    
            if (!data.acudientes || data.acudientes.length === 0) {
                return {
                    success: false,
                    message: "No hay acudientes para este paciente.",
                    acudientes: []
                };
            }
    
            const acudientes = data.acudientes.map(acudiente => ({
                per_id_acudiente: acudiente.per_id_acudiente,
                pa_id: acudiente.pa_id,
                nombre_completo: acudiente.nombre_completo,
                documento: acudiente.documento,
                telefono: acudiente.telefono,
                correo: acudiente.correo,
                parentesco: acudiente.parentesco,
                acudienteActivo: acudiente.acudienteActivo,
            }));
    
            return {
                success: true,
                message: "Acudientes obtenidos correctamente.",
                acudientes
            };
        } catch (error) {
            console.error("❌ Error al obtener acudientes:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error desconocido"
            };
        }
    };

    const pacientesAcudienteActivo = async () => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado."
            };
        }
    
        try {
            const { data } = await geriatricoApi.get(`/acudientes/mispacientes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log("📡 Respuesta del servidor:", data);
    
            return {
                success: true,
                message: "Pacientes con acudiente activo obtenidos correctamente.",
                pacientes: data.pacientes
            };
        } catch (error) {
            console.error("❌ Error al obtener pacientes con acudiente activo:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Error desconocido al obtener los pacientes."
            };
        }
    };
    
    const inactivarRelacionAcudiente = async (pa_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado."
            };
        }
    
        try {
            const { data } = await geriatricoApi.put(`/acudientes/inactivar/${pa_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log("📡 Respuesta del servidor:", data);
    
            return {
                success: true,
                message: "Acudiente inactivado correctamente."
            };
        } catch (error) {
            console.error("❌ Error al inactivar acudiente:", error);
    
            return {
                success: false, 
                message: error.response?.data?.message || "Error desconocido al inactivar el acudiente."
            };
        }
    };
    
    const reactivarRelacionAcudiente = async (pa_id) => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado."
            };
        }
    
        try {
            const { data } = await geriatricoApi.put(`/acudientes/reactivar/${pa_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log("✅ Respuesta del servidor:", data);
            return {
                success: true,
                message: "Acudiente reactivado correctamente."
            };
        } catch (error) {
            console.error("❌ Error al reactivar acudiente:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error desconocido al reactivar el acudiente."
            };
        }
    };

        return {
        registrarAcudiente,
        obtenerAcudientesDePaciente, 
        pacientesAcudienteActivo,
        inactivarRelacionAcudiente,
        reactivarRelacionAcudiente
    };
};
